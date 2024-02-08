use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Email(String);

#[derive(Debug)]
pub enum EmailError {
    InvalidEmail,
    AlreadyUsed,
}

impl TryFrom<&str> for Email {
    type Error = EmailError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let split_at: Vec<_> = value.split('@').collect();
        if split_at.len() != 2 {
            return Err(EmailError::InvalidEmail);
        }

        let split_domain: Vec<_> = split_at.get(1).unwrap().split('.').collect();
        if split_domain.len() < 2 {
            return Err(EmailError::InvalidEmail);
        }

        Ok(Email(value.into()))
    }
}

impl AsRef<str> for Email {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Display for Email {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl From<EmailError> for (&'static str, &'static str) {
    fn from(error: EmailError) -> Self {
        match error {
            EmailError::InvalidEmail => ("invalid_email", "Invalid email format"),
            EmailError::AlreadyUsed => ("email_already_used", "Email address is already in use"),
        }
    }
}
