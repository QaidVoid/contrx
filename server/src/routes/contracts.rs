use axum::extract::{Path, State};
use axum::routing::{get, patch, put};
use axum::{middleware, Extension};
use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::domain::contract::{
    ApprovalPayload, Approver, ApproversPayload, Contract, ContractDocPayload,
    ContractTitlePayload, CreateContract, CreateContractPayload, ProbableApprover,
};
use crate::domain::pagination::{PageCount, PaginatedResponse};
use crate::middleware::auth::auth_middleware;
use crate::{error::Error, AppState};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn contracts_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_contract))
        .route("/single/:contract_id", get(get_contract))
        .route("/approvers/:contract_id", get(get_approvers))
        .route("/:organization_id", get(get_contracts))
        .route("/doc/:contract_id", patch(update_doc))
        .route("/title/:contract_id", patch(update_title))
        .route("/publish/:contract_id", patch(publish))
        .route("/approver", post(add_approvers))
        .route("/approval", put(handle_approval))
        .route(
            "/probable-approvers/:contract_id",
            get(get_probable_approvers),
        )
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}

#[axum::debug_handler]
async fn create_contract(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<CreateContractPayload>,
) -> Result<CreateContract> {
    let contract = CreateContract::try_from(payload)?;

    #[derive(Deserialize, Serialize)]
    struct ContractID {
        id: Uuid,
    }

    #[derive(Deserialize, Serialize)]
    struct Languages {
        content: sqlx::types::JsonValue,
    }

    #[derive(Deserialize, Serialize)]
    struct Document {
        r#type: String,
        content: Vec<serde_json::Value>,
    }

    let mut tx = state.pool.begin().await?;

    let id = sqlx::query_as!(
        ContractID,
        r#"
            INSERT INTO contracts
            (organization_id, contract_type_id, title, description, counterparty_id, definite_term, effective_date, end_date, renewable, status, contract_owner)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (SELECT user_id FROM sessions WHERE id=$11))
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
        "Draft",
        session_id.0
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(Error::from)?;

    let template = sqlx::query_as!(
        Languages,
        r#"
        SELECT
            c.language as content
        FROM clauses c
        JOIN contract_clauses cc ON c.id = cc.clause_id
        JOIN contract_types ct ON cc.contract_type_id = ct.id
        WHERE ct.id = $1
        ORDER BY cc.clause_order
    "#,
        contract.contract_type_id
    )
    .fetch_all(&mut *tx)
    .await?
    .into_iter()
    .flat_map(|langs| {
        let parsed_content: serde_json::Value = json!(&langs.content);
        parsed_content["content"]
            .as_array()
            .unwrap()
            .iter()
            .map(|item| {
                let mut obj = serde_json::Map::new();
                for (key, value) in item.as_object().unwrap().iter() {
                    obj.insert(key.to_string(), value.clone());
                }
                serde_json::Value::from(obj)
            })
            .collect::<Vec<serde_json::Value>>()
    })
    .collect();

    sqlx::query!(
        r#"
            UPDATE contracts
            SET
            document=$2
            WHERE id=$1
        "#,
        id.id,
        json!(Document {
            r#type: "doc".to_string(),
            content: template
        })
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(Json(contract))
}

#[axum::debug_handler]
async fn get_contracts(
    session_id: Extension<Uuid>,
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<Contract>> {
    let pages = sqlx::query_as!(
        PageCount,
        r#"
            SELECT COUNT(*) AS total_count
            FROM contracts
            LEFT JOIN contract_approvers ca
            ON contracts.id=ca.contract_id
            WHERE organization_id = $1 OR ca.approver_id=(SELECT user_id FROM sessions WHERE id=$2)
        "#,
        organization_id,
        session_id.0
    )
    .fetch_one(&state.pool)
    .await?;

    // Also fetch contracts we're approver for
    let contracts = sqlx::query_as!(
        Contract,
        r#"
        SELECT c.*, cp.name as counterparty_name
        FROM contracts c
        JOIN counterparties cp
        ON c.counterparty_id = cp.id
        LEFT JOIN contract_approvers ca
        ON c.id=ca.contract_id
        WHERE c.organization_id=$1 OR ca.approver_id=(SELECT user_id FROM sessions WHERE id=$2)
        "#,
        organization_id,
        session_id.0
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

#[axum::debug_handler]
async fn update_doc(
    Path(contract_id): Path<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<ContractDocPayload>,
) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE contracts
            SET
            document=$2, status='Draft'
            WHERE id=$1
        "#,
        contract_id,
        payload.document
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(()))
}

#[axum::debug_handler]
async fn update_title(
    Path(contract_id): Path<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<ContractTitlePayload>,
) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE contracts
            SET
            title=$2, status='Draft'
            WHERE id=$1
        "#,
        contract_id,
        payload.title
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(()))
}

#[axum::debug_handler]
async fn publish(Path(contract_id): Path<Uuid>, State(state): State<AppState>) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE contracts
            SET
            status='Published'
            WHERE id=$1
        "#,
        contract_id
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(()))
}

#[axum::debug_handler]
async fn add_approvers(
    State(state): State<AppState>,
    Json(payload): Json<ApproversPayload>,
) -> Result<()> {
    for approver in payload.approvers {
        let record = sqlx::query!(
            "SELECT * FROM contract_approvers WHERE approver_id=$1",
            approver.id
        )
        .fetch_optional(&state.pool)
        .await?;

        if record.is_some() {
            continue;
        }

        sqlx::query!(
            r#"
                INSERT INTO contract_approvers (contract_id, approver_id)
                VALUES
                ($1, $2)
            "#,
            payload.contract_id,
            approver.id
        )
        .execute(&state.pool)
        .await?;
    }

    Ok(Json(()))
}

#[axum::debug_handler]
async fn handle_approval(
    State(state): State<AppState>,
    Json(payload): Json<ApprovalPayload>,
) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE contract_approvers
            SET
            status=$3
            WHERE approver_id=$1 AND contract_id=$2
        "#,
        payload.approver_id,
        payload.contract_id,
        payload.status
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(()))
}

#[axum::debug_handler]
async fn get_approvers(
    Path(contract_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Vec<Approver>> {
    let approvers = sqlx::query_as!(
        Approver,
        r#"
            SELECT ca.contract_id, ca.approver_id, ca.status as approval_status, concat_ws(' ', u.first_name, u.last_name) as approver_name
            FROM contract_approvers ca
            JOIN users u
            ON u.id=ca.approver_id
            WHERE ca.contract_id=$1
        "#,
        contract_id
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(approvers))
}

#[axum::debug_handler]
async fn get_probable_approvers(
    Path(contract_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Vec<ProbableApprover>> {
    let approvers = sqlx::query_as!(
        ProbableApprover,
        r#"
            SELECT u.id, ct.full_name as name
            FROM contracts c
            JOIN counterparties cp
            ON cp.id=c.counterparty_id
            JOIN contacts ct
            ON cp.id=c.counterparty_id
            JOIN users u
            ON u.email=ct.email
            WHERE c.id=$1
        "#,
        contract_id
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(approvers))
}
