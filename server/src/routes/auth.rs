use argon2::{Argon2, PasswordHash};
use axum::{extract::State, routing::post, Extension, Json, Router};
use serde::{Deserialize, Serialize};
use tower_cookies::{Cookie, Cookies};
use uuid::Uuid;

use crate::{
    domain::auth::{create_access_token, create_refresh_token, AuthError, AuthToken, LoginPayload},
    error::Error,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
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
