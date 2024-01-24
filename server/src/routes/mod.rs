use axum::{http::StatusCode, routing::get, Router};

use crate::AppState;

async fn not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health() -> StatusCode {
    StatusCode::OK
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .fallback(not_found)
        .with_state(state)
}
