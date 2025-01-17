#![feature(lazy_cell)]

use config::Config;
use sqlx::{Pool, Postgres};
use tokio::signal;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::routes::create_router;

pub mod config;
pub mod constants;
pub mod database;
pub mod domain;
pub mod error;
pub mod middleware;
pub mod routes;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool<Postgres>,
}

pub async fn run(config: &Config, pool: &Pool<Postgres>) {
    let state = AppState {
        pool: pool.to_owned(),
    };
    let app = create_router(state);
    let addr = format!("{}:{}", config.app.host, config.app.port);

    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(v) => v,
        Err(e) => panic!("Can't bind to address: {addr}. {e}"),
    };

    println!("Starting server on: {addr}");

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "contrx_server=debug,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl-C handler.");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install signal handler.")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {}
    }
}
