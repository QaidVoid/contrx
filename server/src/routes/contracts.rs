use axum::extract::{Path, State};
use axum::routing::get;
use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::domain::contract::{Contract, CreateContract, CreateContractPayload};
use crate::domain::pagination::{PageCount, PaginatedResponse};
use crate::{error::Error, AppState};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn contracts_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_contract))
        .route("/:organization_id", get(get_contracts))
        .route("/single/:contract_id", get(get_contract))
}

#[axum::debug_handler]
async fn create_contract(
    State(state): State<AppState>,
    Json(payload): Json<CreateContractPayload>,
) -> Result<CreateContract> {
    let contract = CreateContract::try_from(payload)?;

    #[derive(Deserialize, Serialize)]
    struct ContractID {
        id: Uuid
    }

    #[derive(Deserialize, Serialize)]
    struct Languages {
        language: sqlx::types::JsonValue
    }

    let mut tx = state.pool.begin().await?;

    let id = sqlx::query_as!(
        ContractID,
        r#"
            INSERT INTO contracts
            (organization_id, contract_type_id, title, description, counterparty_id, definite_term, effective_date, end_date, renewable, status)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            returning id
        "#,
        contract.organization_id,
        contract.contract_type_id,
        contract.title,
        contract.description,
        contract.counterparty_id,
        false,
        contract.effective_date,
        contract.end_date.unwrap(),
        false,
        "Draft"
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(Error::from)?;

    let template = sqlx::query_as!(
        Languages,
        r#"
        SELECT
            c.language
        FROM clauses c
        JOIN contract_clauses cc ON c.id = cc.clause_id
        JOIN contract_types ct ON cc.contract_type_id = ct.id
        WHERE ct.id = $1
        ORDER BY cc.clause_order
    "#,
        contract.contract_type_id
    )
    .fetch_all(&mut *tx)
    .await?;

    sqlx::query!(
        r#"
            UPDATE contracts
            SET
            document=$2
            WHERE id=$1
        "#,
        id.id,
        json!(template)
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(Json(contract))
}

#[axum::debug_handler]
async fn get_contracts(
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<Contract>> {
    let pages = sqlx::query_as!(
        PageCount,
        r#"
            SELECT COUNT(*) AS total_count
            FROM contracts
            WHERE organization_id = $1
        "#,
        organization_id
    )
    .fetch_one(&state.pool)
    .await?;

    let contracts = sqlx::query_as!(
        Contract,
        r#"
        SELECT c.*, cp.name as counterparty_name
        FROM contracts c
        JOIN counterparties cp
        ON c.counterparty_id = cp.id
        WHERE c.organization_id=$1
        "#,
        organization_id
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(PaginatedResponse {
        data: contracts,
        total_count: pages.total_count,
    }))
}

#[axum::debug_handler]
async fn get_contract(
    Path(contract_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Contract> {
    let contracts = sqlx::query_as!(
        Contract,
        r#"
            SELECT c.*, cp.name as counterparty_name
            FROM contracts c
            JOIN counterparties cp
            ON c.counterparty_id = cp.id
            WHERE c.id=$1
        "#,
        contract_id
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(contracts))
}
