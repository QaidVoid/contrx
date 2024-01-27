use std::time::Duration;

use axum::{http::StatusCode, routing::get, Router};
use tower_http::{timeout::TimeoutLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::AppState;

async fn not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health() -> StatusCode {
    StatusCode::OK
}

pub fn create_router(state: AppState) -> Router {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "contrx_server=debug,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    Router::new()
        .route("/health", get(health))
        .fallback(not_found)
        .with_state(state)
        .layer((
            TraceLayer::new_for_http(),
            TimeoutLayer::new(Duration::from_secs(10)),
        ))
}
