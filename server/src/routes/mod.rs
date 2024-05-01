use std::time::Duration;

use axum::{http::StatusCode, routing::get, Router};
use tower_cookies::CookieManagerLayer;
use tower_http::cors::{Any, CorsLayer};
use tower_http::{timeout::TimeoutLayer, trace::TraceLayer};

use crate::AppState;

use self::{auth::auth_router, users::users_router};

mod auth;
mod users;

async fn not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health() -> StatusCode {
    StatusCode::OK
}

pub fn create_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_headers(Any)
        .allow_methods(Any)
        .allow_origin(Any);

    Router::new()
        .route("/health", get(health))
        .nest("/api/auth", auth_router(&state))
        .nest("/api/users", users_router())
        .fallback(not_found)
        .with_state(state)
        .layer(cors)
        .layer((
            CookieManagerLayer::new(),
            TraceLayer::new_for_http(),
            TimeoutLayer::new(Duration::from_secs(10)),
        ))
}
