use std::time::Duration;

use axum::{http::StatusCode, routing::get, Router};
use tower_http::{timeout::TimeoutLayer, trace::TraceLayer};

use crate::AppState;

use self::users::users_router;

mod users;

async fn not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health() -> StatusCode {
    StatusCode::OK
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .nest("/api/users", users_router())
        .fallback(not_found)
        .with_state(state)
        .layer((
            TraceLayer::new_for_http(),
            TimeoutLayer::new(Duration::from_secs(10)),
        ))
}
