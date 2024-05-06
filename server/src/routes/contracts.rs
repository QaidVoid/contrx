use axum::extract::State;
use axum::{routing::post, Json, Router};

use crate::domain::contract::{CreateContract, CreateContractPayload};
use crate::{error::Error, AppState};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn contracts_router() -> Router<AppState> {
    Router::new().route("/", post(create_contract))
}

#[axum::debug_handler]
async fn create_contract(
    State(state): State<AppState>,
    Json(payload): Json<CreateContractPayload>,
) -> Result<CreateContract> {
    let contract = CreateContract::try_from(payload)?;
    // sqlx::query!(
    //     r#"
    // INSERT INTO contracts (contract_type)
    // "#,
    // )
    // .execute(&state.pool)
    // .await
    // .map_err(Error::from)?;

    Ok(Json(contract))
}
