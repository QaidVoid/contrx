use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Name(String);

pub enum NameError {
    EmptyName(NameType),
}

pub enum NameType {
    FirstName,
    LastName,
}

impl TryFrom<(&str, NameType)> for Name {
    type Error = NameError;

    fn try_from(value: (&str, NameType)) -> Result<Self, Self::Error> {
        let (name_str, field_type) = value;
        if name_str.is_empty() {
            return Err(NameError::EmptyName(field_type));
        }
        Ok(Self(name_str.into()))
    }
}

impl AsRef<str> for Name {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Display for Name {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl From<NameError> for (&'static str, &'static str) {
    fn from(error: NameError) -> Self {
        match error {
            NameError::EmptyName(NameType::FirstName) => {
                ("empty_first_name", "First name can't be empty")
            }
            NameError::EmptyName(NameType::LastName) => {
                ("empty_last_name", "Last name can't be empty")
            }
        }
    }
}
