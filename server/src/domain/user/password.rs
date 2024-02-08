use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Password(String);

#[derive(Debug)]
pub enum PasswordError {
    EmptyPassword(PasswordType),
    PasswordMismatch,
}

#[derive(Debug)]
pub enum PasswordType {
    Password,
    ConfirmPassword,
}

impl TryFrom<(&str, PasswordType)> for Password {
    type Error = PasswordError;

    fn try_from(value: (&str, PasswordType)) -> Result<Self, Self::Error> {
        let (password_str, field_type) = value;
        if password_str.is_empty() {
            return Err(PasswordError::EmptyPassword(field_type));
        }
        Ok(Password(password_str.into()))
    }
}

impl Password {
    pub fn check(password: &str, other_password: &str) -> Result<(), PasswordError> {
        if password != other_password {
            return Err(PasswordError::PasswordMismatch);
        }
        Ok(())
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
            PasswordError::EmptyPassword(PasswordType::Password) => {
                ("empty_password", "Password can't be empty")
            }
            PasswordError::EmptyPassword(PasswordType::ConfirmPassword) => {
                ("empty_confirm_password", "Confirm password can't be empty")
            }
            PasswordError::PasswordMismatch => (
                "password_mismatch",
                "Password and confirm password doesn't match",
            ),
        }
    }
}
