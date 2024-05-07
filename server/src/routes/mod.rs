use std::time::Duration;

use axum::http::{header, Method};
use axum::{http::StatusCode, routing::get, Router};
use tower_cookies::CookieManagerLayer;
use tower_http::cors::{Any, CorsLayer};
use tower_http::{timeout::TimeoutLayer, trace::TraceLayer};

use crate::AppState;

use self::clauses::clauses_router;
use self::contracts::contracts_router;
use self::organizations::organizations_router;
use self::{auth::auth_router, users::users_router};

mod auth;
mod clauses;
mod contracts;
mod organizations;
mod users;

async fn not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health() -> StatusCode {
    StatusCode::OK
}

pub fn create_router(state: AppState) -> Router {
    let origin = ["http://localhost:5173".parse().unwrap()];
    let methods = [
        Method::GET,
        Method::POST,
        Method::PUT,
        Method::PATCH,
        Method::DELETE,
    ];
    let headers = [header::AUTHORIZATION, header::COOKIE, header::CONTENT_TYPE];

    let cors = CorsLayer::new()
        .allow_headers(headers)
        .allow_methods(methods)
        .allow_origin(origin)
        .allow_credentials(true);

    Router::new()
        .route("/health", get(health))
        .nest("/api/auth", auth_router(&state))
        .nest("/api/users", users_router())
        .nest("/api/organizations", organizations_router(&state))
        .nest("/api/clauses", clauses_router(&state))
        .nest("/api/contracts", contracts_router())
        .fallback(not_found)
        .with_state(state)
        .layer(cors)
        .layer((
            CookieManagerLayer::new(),
            TraceLayer::new_for_http(),
            TimeoutLayer::new(Duration::from_secs(10)),
        ))
}
