use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::Error;

use self::{
    email::Email,
    name::{Name, NameType},
    password::{Password, PasswordType},
};

mod email;
mod name;
mod password;

pub use email::EmailError;
pub use password::PasswordError;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateUserPayload {
    pub email: String,
    pub password: String,
    pub confirm_password: String,
    pub first_name: String,
    pub last_name: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateUser {
    pub email: Email,

    #[serde(skip_serializing)]
    pub password: Password,

    #[serde(skip_serializing)]
    pub confirm_password: Password,

    pub first_name: Name,
    pub last_name: Name,
}


#[derive(Deserialize, Serialize, Debug)]
pub struct SafeUser {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String
}

#[derive(Deserialize, Serialize, Debug)]
pub struct OrganizationUser {
    pub id: String,
    pub user_id: Uuid,
    pub organization_id: Uuid,
    pub role: String,
    pub status: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct OrgUser {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub status: String,
    pub role: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewUser {
    pub email: String,
    pub role: String,
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
        let password = Password::try_from((payload.password.as_str(), PasswordType::Password))
            .map(Some)
            .unwrap_or_else(|error| {
                builder.error(error.into());
                None
            });
        let confirm_password = Password::try_from((
            payload.confirm_password.as_str(),
            PasswordType::ConfirmPassword,
        ))
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

        Password::check(payload.password.as_str(), payload.confirm_password.as_str())
            .unwrap_or_else(|error| {
                builder.error(error.into());
            });

        if builder.is_empty() {
            Ok(CreateUser {
                email: email.unwrap(),
                password: password.unwrap(),
                confirm_password: confirm_password.unwrap(),
                first_name: first_name.unwrap(),
                last_name: last_name.unwrap(),
            })
        } else {
            Err(builder.build())
        }
    }
}
