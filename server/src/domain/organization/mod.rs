use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{constants::countries::COUNTRIES, error::Error};

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateOrganizationPayload {
    pub name: String,
    pub country: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateOrganization {
    pub name: String,
    pub country: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Organization {
    pub id: Uuid,
    pub name: String,
    pub country: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EditOrganizationPayload {
    pub id: Uuid,
    pub name: String,
    pub country: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EditOrganization {
    pub id: Uuid,
    pub name: String,
    pub country: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateCounterPartyPayload {
    pub name: String,
    pub r#type: String,
    pub full_name: String,
    pub email: String
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CounterParty {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub name: String,
    pub r#type: String,
    pub full_name: String,
    pub email: String,
    pub website: Option<String>
}

impl TryFrom<CreateOrganizationPayload> for CreateOrganization {
    type Error = Error;

    fn try_from(payload: CreateOrganizationPayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        let country = COUNTRIES.contains(&payload.country.as_str());
        if !country {
            builder.error(("invalid_country", "Invalid country"));
        }

        if builder.is_empty() {
            Ok(CreateOrganization {
                name: payload.name,
                country: payload.country,
            })
        } else {
            Err(builder.build())
        }
    }
}

impl TryFrom<EditOrganizationPayload> for EditOrganization {
    type Error = Error;

    fn try_from(payload: EditOrganizationPayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        let country = COUNTRIES.contains(&payload.country.as_str());
        if !country {
            builder.error(("invalid_country", "Invalid country"));
        }

        if builder.is_empty() {
            Ok(EditOrganization {
                id: payload.id,
                name: payload.name,
                country: payload.country,
            })
        } else {
            Err(builder.build())
        }
    }
}
