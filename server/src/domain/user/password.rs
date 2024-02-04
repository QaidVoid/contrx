use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Password(String);

#[derive(Debug)]
pub enum PasswordError {
    EmptyPassword,
}

impl TryFrom<&str> for Password {
    type Error = PasswordError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        if value.is_empty() {
            return Err(PasswordError::EmptyPassword);
        }
        Ok(Password(value.into()))
    }
}

impl AsRef<str> for Password {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Display for Password {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl From<PasswordError> for (&'static str, &'static str) {
    fn from(error: PasswordError) -> Self {
        match error {
            PasswordError::EmptyPassword => ("empty_password", "Password can't be empty"),
        }
    }
}
