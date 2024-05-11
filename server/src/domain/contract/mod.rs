use serde::{Deserialize, Serialize};

use crate::error::Error;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContractPayload {
    pub contract_type: String,
    pub title: String,
    pub description: String,
    pub effective_date: String,
    pub expiry_date: String,
    pub counterparty: String
}

#[derive(Deserialize, Serialize, Debug)]
pub enum ContractStatus {
    Draft,
    Active,
    Expired
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Contract {
    pub contract_type: String,
    pub title: String,
    pub description: String,
    pub effective_date: String,
    pub counterparty: String,
    pub expiry_date: String,
    pub status: ContractStatus,
    pub blockchain_hash: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContract {
    pub contract_type: String,
    pub title: String,
    pub description: String,
    pub effective_date: String,
    pub expiry_date: String,
    pub counterparty: String
}


impl TryFrom<CreateContractPayload> for CreateContract {
    type Error = Error;

    fn try_from(payload: CreateContractPayload) -> Result<Self, Self::Error> {
        let builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateContract {
                contract_type: payload.contract_type,
                title: payload.title,
                description: payload.description,
                effective_date: payload.effective_date,
                expiry_date: payload.expiry_date,
                counterparty: payload.counterparty
            })
        } else {
            Err(builder.build())
        }
    }
}
