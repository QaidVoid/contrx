use serde::{Deserialize, Serialize};

use crate::error::Error;

use super::clause::OrganizationClause;

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplatePayload {
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplate {
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Template {
    pub id: uuid::Uuid,
    pub name: String,
    pub category: String,
    pub intent: String,
    pub party_a_is_self: bool,
    pub party_b_is_self: bool,
    pub status: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplateClausePayload {
    pub contract_type_id: uuid::Uuid,
    pub clause_id: uuid::Uuid,
    pub clause_order: i64,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateTemplateClause {
    pub contract_type_id: uuid::Uuid,
    pub clause_id: uuid::Uuid,
    pub clause_order: i64,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct TemplateClauses {
    pub id: uuid::Uuid,
    pub contract_type_id: uuid::Uuid,
    pub clause_id: uuid::Uuid,
    pub clause_order: i64,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct TemplateWithClauses {
    pub contract_type: Template,
    pub clauses: Vec<OrganizationClause>
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
                party_b_is_self: payload.party_b_is_self,
            })
        } else {
            Err(builder.build())
        }
    }
}

impl TryFrom<CreateTemplateClausePayload> for CreateTemplateClause {
    type Error = Error;

    fn try_from(payload: CreateTemplateClausePayload) -> Result<Self, Self::Error> {
        let mut builder = Error::builder();

        if builder.is_empty() {
            Ok(CreateTemplateClause {
                contract_type_id: payload.contract_type_id,
                clause_id: payload.clause_id,
                clause_order: payload.clause_order,
            })
        } else {
            Err(builder.build())
        }
    }
}
