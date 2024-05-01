use argon2::{Argon2, PasswordHash};
use axum::{extract::State, middleware, routing::post, Extension, Json, Router};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use tower_cookies::{
    cookie::{time::Duration, SameSite},
    Cookie, Cookies,
};
use uuid::Uuid;

use crate::{
    config::CONFIG,
    domain::auth::{
        create_access_token, create_refresh_token, AuthError, AuthToken, Claims, LoginPayload,
    },
    error::Error,
    middleware::auth::auth_middleware,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn auth_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/logout", post(logout))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth_middleware))
        .route("/login", post(login))
        .route("/refresh_token", post(refresh_token))
}

#[axum::debug_handler]
async fn login(
    State(state): State<AppState>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<AuthToken> {
    #[derive(Serialize, Deserialize)]
    struct AuthUser {
        id: i64,
        password_hash: String,
    }

    let user = sqlx::query_as!(
        AuthUser,
        r#"
            SELECT id, password_hash FROM users WHERE email = $1
        "#,
        payload.email
    )
    .fetch_one(&state.pool)
    .await
    .map_err(|error| match error {
        sqlx::Error::RowNotFound => AuthError::InvalidCredentials.into(),
        _ => Error::InternalServerError,
    })?;

    verify_password(payload.password, user.password_hash).await?;

    let session_id = Uuid::new_v4();
    let refresh_token = create_refresh_token(session_id)?;
    let access_token = create_access_token(session_id)?;

    sqlx::query!(
        r#"
            INSERT INTO sessions (id, user_id) VALUES ($1, $2)
        "#,
        &session_id,
        user.id
    )
    .execute(&state.pool)
    .await
    .map_err(Error::from)?;

    cookies.add(Cookie::new("refresh_token", refresh_token.to_owned()));

    Ok(Json(AuthToken {
        refresh_token,
        access_token,
    }))
}

async fn logout(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
    cookies: Cookies,
) -> Result<()> {
    let sid = session_id.0;
    sqlx::query!("DELETE FROM sessions WHERE id = $1", sid)
        .execute(&state.pool)
        .await
        .map_err(|_| Error::Unauthorized)?;

    cookies.remove(Cookie::new("refresh_token", ""));

    Ok(Json(()))
}

#[axum::debug_handler]
async fn refresh_token(State(state): State<AppState>, cookies: Cookies) -> Result<AuthToken> {
    let token = match cookies.get("refresh_token") {
        Some(c) => c.value().to_owned(),
        None => return Err(Error::Unauthorized)?,
    };

    let mut validation = Validation::default();
    validation.leeway = 0;

    let secret = &CONFIG.secret.refresh;

    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
    .map_err(|_| Error::Unauthorized)?;

    let row = sqlx::query!("SELECT id FROM sessions WHERE id=$1", token.claims.sid)
        .fetch_one(&state.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AuthError::InvalidSession.into(),
            _ => Error::InternalServerError,
        })?;

    let session_id = Uuid::new_v4();
    let refresh_token = create_refresh_token(session_id).map_err(|_| Error::InternalServerError)?;
    let access_token = create_access_token(session_id).map_err(|_| Error::InternalServerError)?;

    sqlx::query!(
        "UPDATE sessions SET id = $2 WHERE id = $1",
        row.id,
        session_id
    )
    .execute(&state.pool)
    .await
    .map_err(|_| AuthError::InvalidCredentials)?;

    let mut cookie = Cookie::new("refresh_token", refresh_token.clone());
    cookie.set_http_only(true);
    cookie.set_same_site(SameSite::Lax);
    cookie.set_secure(true);
    cookie.set_max_age(Duration::weeks(12));

    cookies.add(cookie);

    Ok(Json(AuthToken {
        access_token,
        refresh_token,
    }))
}

async fn verify_password(
    password: String,
    password_hash: String,
) -> std::result::Result<(), Error> {
    tokio::task::spawn_blocking(move || -> std::result::Result<(), Error> {
        let hash = PasswordHash::new(&password_hash).map_err(|_| Error::InternalServerError)?;

        hash.verify_password(&[&Argon2::default()], password)
            .map_err(|error| match error {
                argon2::password_hash::Error::Password => AuthError::InvalidCredentials.into(),
                _ => Error::InternalServerError,
            })
    })
    .await
    .map_err(|_| Error::InternalServerError)?
}
