use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use axum::{extract::State, routing::post, Json, Router};

use crate::{
    domain::user::{CreateUser, CreateUserPayload},
    error::Error,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn users_router() -> Router<AppState> {
    Router::new().route("/", post(create_user))
}

#[axum::debug_handler]
async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserPayload>,
) -> Result<CreateUser> {
    let user = CreateUser::try_from(payload)?;
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(user.password.as_ref().as_bytes(), &salt)
        .map_err(Error::from)?
        .to_string();

    sqlx::query!(
        r#"
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    "#,
        user.email.as_ref(),
        password_hash,
        user.first_name.as_ref(),
        user.last_name.as_ref()
    )
    .execute(&state.pool)
    .await
    .map_err(Error::from)?;

    Ok(Json(user))
}
