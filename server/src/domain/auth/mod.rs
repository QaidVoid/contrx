use std::time::{Duration, UNIX_EPOCH};

use jsonwebtoken::{encode, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::CONFIG, error::Error};

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginPayload {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AuthToken {
    pub access_token: String,
    pub refresh_token: String,
}

pub enum AuthError {
    InvalidCredentials,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sid: Uuid,
    exp: u64,
}

impl From<AuthError> for Error {
    fn from(_: AuthError) -> Self {
        Error::unprocessable_entity([("invalid_credentials", "Invalid login credentials")])
    }
}

fn create_token(sid: Uuid, duration: Duration, secret: &str) -> Result<String, Error> {
    let exp = duration
        .checked_add(UNIX_EPOCH.elapsed().unwrap())
        .unwrap_or_default()
        .as_secs();

    let claims = Claims { sid, exp };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| Error::InternalServerError)?;

    Ok(token)
}

pub fn create_refresh_token(sid: Uuid) -> Result<String, Error> {
    let duration = Duration::from_secs(86400 * 60);
    let mut validation = Validation::default();
    validation.leeway = 0;
    create_token(sid, duration, &CONFIG.secret.refresh)
}

pub fn create_access_token(sid: Uuid) -> Result<String, Error> {
    let duration = Duration::from_secs(1200);
    create_token(sid, duration, &CONFIG.secret.access)
}
