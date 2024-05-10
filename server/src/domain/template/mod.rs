use serde::{Deserialize, Serialize};

use crate::error::Error;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplatePayload {
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplate {
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Template {
    pub id: uuid::Uuid,
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool,
    pub status: String
}

impl TryFrom<CreateTemplatePayload> for CreateTemplate {
    type Error = Error;

    fn try_from(payload: CreateTemplatePayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateTemplate {
                name: payload.name,
                category: payload.category,
                intent: payload.intent,
                party_a_is_self: payload.party_a_is_self,
                party_b_is_self: payload.party_b_is_self
            })
        } else {
            Err(builder.build())
        }
    }
}
