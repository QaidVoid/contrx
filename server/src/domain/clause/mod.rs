use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::Error;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateClausePayload {
    pub organization_id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
    pub is_default: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateClause {
    pub organization_id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
    pub is_default: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Clause {
    pub id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
    pub is_default: bool,
    pub last_modified_by: Uuid,
    pub last_modified_at: time::OffsetDateTime,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct OrganizationClause {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
    pub is_default: bool,
    pub last_modified_by: Option<String>,
    pub last_modified_at: time::OffsetDateTime,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EditClausePayload {
    pub id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EditClause {
    pub id: Uuid,
    pub title: String,
    pub name: String,
    pub r#type: String,
    pub language: sqlx::types::JsonValue,
    pub is_default: bool
}

impl TryFrom<CreateClausePayload> for CreateClause {
    type Error = Error;

    fn try_from(payload: CreateClausePayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateClause {
                organization_id: payload.organization_id,
                title: payload.title,
                name: payload.name,
                r#type: payload.r#type,
                language: payload.language,
                is_default: payload.is_default
            })
        } else {
            Err(builder.build())
        }
    }
}

impl TryFrom<EditClausePayload> for EditClause {
    type Error = Error;

    fn try_from(payload: EditClausePayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        if builder.is_empty() {
            Ok(EditClause {
                id: payload.id,
                title: payload.title,
                name: payload.name,
                r#type: payload.r#type,
                language: payload.language,
                is_default: false
            })
        } else {
            Err(builder.build())
        }
    }
}
