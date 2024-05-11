use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::error::Error;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContractPayload {
    pub organization_id: Uuid,
    pub contract_type_id: Uuid,
    pub title: String,
    pub description: String,
    pub effective_date: OffsetDateTime,
    pub end_date: Option<OffsetDateTime>,
    pub counterparty_id: Uuid
}

#[derive(Deserialize, Serialize, Debug)]
pub enum ContractStatus {
    Draft,
    Active,
    Expired
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Contract {
    pub id: Uuid,
    pub contract_type_id: Uuid,
    pub organization_id: Uuid,
    pub title: String,
    pub description: String,
    pub definite_term: bool,
    pub counterparty_id: Uuid,
    pub counterparty_name: String,
    pub effective_date: OffsetDateTime,
    pub renewable: bool,
    pub end_date: Option<OffsetDateTime>,
    pub status: String,
    pub document: sqlx::types::JsonValue
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContract {
    pub organization_id: Uuid,
    pub contract_type_id: Uuid,
    pub title: String,
    pub description: String,
    pub effective_date: OffsetDateTime,
    pub end_date: Option<OffsetDateTime>,
    pub counterparty_id: Uuid
}


impl TryFrom<CreateContractPayload> for CreateContract {
    type Error = Error;

    fn try_from(payload: CreateContractPayload) -> Result<Self, Self::Error> {
        let builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateContract {
                organization_id: payload.organization_id,
                contract_type_id: payload.contract_type_id,
                title: payload.title,
                description: payload.description,
                effective_date: payload.effective_date,
                end_date: payload.end_date,
                counterparty_id: payload.counterparty_id
            })
        } else {
            Err(builder.build())
        }
    }
}
