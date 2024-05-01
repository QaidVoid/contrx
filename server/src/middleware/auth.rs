use axum::{extract::State, http::Request, middleware::Next, response::Response};
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::{
    config::CONFIG,
    domain::auth::{AuthError, Claims},
    error::{self, Error},
    AppState,
};

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, error::Error> {
    let auth = request.headers().get("authorization");
    let auth = match auth {
        Some(v) => v.to_str().map_err(|_| AuthError::InvalidHeader)?,
        None => return Err(AuthError::MissingToken)?,
    };

    if !auth.starts_with("Bearer ") {
        return Err(AuthError::InvalidTokenFormat)?;
    }

    let token = auth.trim_start_matches("Bearer ");

    let mut validation = Validation::default();
    validation.leeway = 0;

    let secret = &CONFIG.secret.access;

    let token = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
    .map_err(|_| Error::Unauthorized)?;

    sqlx::query!("SELECT id FROM sessions WHERE id=$1", token.claims.sid)
        .fetch_one(&state.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AuthError::InvalidSession.into(),
            _ => Error::InternalServerError,
        })?;

    let session_id = token.claims.sid;
    request.extensions_mut().insert(session_id);

    let response = next.run(request).await;
    Ok(response)
}
