use std::borrow::Cow;

use axum::{
    http::{header::WWW_AUTHENTICATE, HeaderMap, HeaderValue, Response, StatusCode},
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};

use crate::domain::user::EmailError;

pub enum Error {
    UnprocessableEntity { errors: Vec<ErrorDetail> },
    InternalServerError,
    Unauthorized,
}

#[derive(Deserialize, Serialize)]
pub struct ErrorDetail {
    pub code: Cow<'static, str>,
    pub message: Cow<'static, str>,
}

pub struct ErrorBuilder {
    errors: Vec<(Cow<'static, str>, Cow<'static, str>)>,
}

impl Error {
    pub fn unprocessable_entity<K, V>(errors: impl IntoIterator<Item = (K, V)>) -> Self
    where
        K: Into<Cow<'static, str>>,
        V: Into<Cow<'static, str>>,
    {
        let mut error_map = Vec::new();

        for (key, val) in errors {
            error_map.push(ErrorDetail {
                code: key.into(),
                message: val.into(),
            })
        }

        Self::UnprocessableEntity { errors: error_map }
    }

    pub fn builder() -> ErrorBuilder {
        ErrorBuilder { errors: Vec::new() }
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response<axum::body::Body> {
        match self {
            Self::UnprocessableEntity { errors } => {
                #[derive(Serialize)]
                struct Errors {
                    errors: Vec<ErrorDetail>,
                }
                (StatusCode::UNPROCESSABLE_ENTITY, Json(Errors { errors })).into_response()
            }
            Self::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                [(WWW_AUTHENTICATE, HeaderValue::from_static("Token"))]
                    .into_iter()
                    .collect::<HeaderMap>(),
                "Authentication is required",
            )
                .into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response(),
        }
    }
}

impl ErrorBuilder {
    pub fn error<K, V>(&mut self, error: (K, V))
    where
        K: Into<Cow<'static, str>>,
        V: Into<Cow<'static, str>>,
    {
        let (key, value) = error;
        self.errors.push((key.into(), value.into()));
    }

    pub fn build(&self) -> Error {
        Error::unprocessable_entity(self.errors.to_owned())
    }

    pub fn is_empty(&self) -> bool {
        self.errors.is_empty()
    }
}

impl From<sqlx::Error> for Error {
    fn from(error: sqlx::Error) -> Self {
        let mut builder = Error::builder();
        match error {
            sqlx::Error::Database(dbe) if dbe.constraint() == Some("users_email_key") => {
                builder.error(EmailError::AlreadyUsed.into())
            }
            _ => return Error::InternalServerError,
        }
        builder.build()
    }
}

impl From<argon2::password_hash::Error> for Error {
    fn from(_: argon2::password_hash::Error) -> Self {
        Error::InternalServerError
    }
}
