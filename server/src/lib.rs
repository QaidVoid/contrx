use sqlx::{Pool, Postgres};

use crate::routes::create_router;

pub mod database;
mod routes;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool<Postgres>
}

pub async fn run(pool: &Pool<Postgres>) {
    let state = AppState { pool: pool.to_owned() };
    let app = create_router(state);

    let addr = "0.0.0.0:3000";
    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(v) => v,
        Err(e) => panic!("Can't bind to address: {addr}. {e}"),
    };

    println!("Starting server on: {addr}");
    axum::serve(listener, app).await.unwrap();
}
