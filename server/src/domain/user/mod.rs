use serde::{Deserialize, Serialize};

use crate::error::Error;

use self::{
    email::Email,
    name::{Name, NameType},
    password::Password,
};

mod email;
mod name;
mod password;

pub use email::EmailError;
pub use password::PasswordError;

#[derive(Deserialize, Serialize)]
pub struct CreateUserPayload {
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
}

#[derive(Deserialize, Serialize)]
pub struct CreateUser {
    pub email: Email,
    pub password: Password,
    pub first_name: Name,
    pub last_name: Name,
}

impl TryFrom<CreateUserPayload> for CreateUser {
    type Error = Error;

    fn try_from(payload: CreateUserPayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        let email = Email::try_from(payload.email.as_str())
            .map(Some)
            .unwrap_or_else(|error| {
                builder.error(error.into());
                None
            });
        let password = Password::try_from(payload.password.as_str())
            .map(Some)
            .unwrap_or_else(|error| {
                builder.error(error.into());
                None
            });
        let first_name = Name::try_from((payload.first_name.as_str(), NameType::FirstName))
            .map(Some)
            .unwrap_or_else(|error| {
                builder.error(error.into());
                None
            });
        let last_name = Name::try_from((payload.last_name.as_str(), NameType::LastName))
            .map(Some)
            .unwrap_or_else(|error| {
                builder.error(error.into());
                None
            });

        if builder.is_empty() {
            Ok(CreateUser {
                email: email.unwrap(),
                password: password.unwrap(),
                first_name: first_name.unwrap(),
                last_name: last_name.unwrap(),
            })
        } else {
            Err(builder.build())
        }
    }
}
