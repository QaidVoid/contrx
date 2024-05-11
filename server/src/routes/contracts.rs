use axum::extract::{Path, State};
use axum::routing::get;
use axum::{routing::post, Json, Router};
use uuid::Uuid;

use crate::domain::contract::{Contract, CreateContract, CreateContractPayload};
use crate::domain::pagination::{PageCount, PaginatedResponse};
use crate::{error::Error, AppState};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn contracts_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_contract))
        .route("/:organization_id", get(get_contracts))
}

#[axum::debug_handler]
async fn create_contract(
    State(state): State<AppState>,
    Json(payload): Json<CreateContractPayload>,
) -> Result<CreateContract> {
    let contract = CreateContract::try_from(payload)?;
    sqlx::query!(
        r#"
            INSERT INTO contracts
            (organization_id, contract_type_id, title, description, counterparty_id, definite_term, effective_date, end_date, renewable, status)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
    .execute(&state.pool)
    .await
    .map_err(Error::from)?;

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
