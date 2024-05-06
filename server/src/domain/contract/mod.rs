use serde::{Deserialize, Serialize};

use crate::error::Error;

pub mod party;

#[derive(Deserialize, Serialize, Debug)]
pub struct Party {
    pub party_type: String,
    pub party_repr_id: String
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContractPayload {
    pub contract_type: String,
    pub description: String,
    pub effective_date: String,
    pub parties_involved: Vec<String>,
    pub expiry_date: String
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
    pub description: String,
    pub effective_date: String,
    pub parties_involved: Vec<Party>,
    pub expiry_date: String,
    pub status: ContractStatus,
    pub blockchain_hash: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateContract {
    pub contract_type: String,
    pub description: String,
    pub effective_date: String,
    pub parties_involved: Vec<String>,
    pub expiry_date: String
}


impl TryFrom<CreateContractPayload> for CreateContract {
    type Error = Error;

    fn try_from(payload: CreateContractPayload) -> Result<Self, Self::Error> {
        let builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateContract {
                contract_type: payload.contract_type,
                description: payload.description,
                effective_date: payload.effective_date,
                parties_involved: payload.parties_involved,
                expiry_date: payload.expiry_date,
            })
        } else {
            Err(builder.build())
        }
    }
}
