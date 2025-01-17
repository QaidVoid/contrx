use axum::{
    body::Body,
    http::{Request, Response},
    Router,
};
use contrx_server::{
    config::Config, database::Database, domain::user::CreateUserPayload, routes::create_router,
    AppState,
};

pub mod mock;

use sqlx::PgPool;
use tower::ServiceExt;
use uuid::Uuid;

pub struct TestApp {
    config: Config,
    pool: PgPool,
    pub app: Router,
}

impl TestApp {
    pub async fn new() -> TestApp {
        let mut config = Config::new();

        let tmp = Database::new(&config.default_database_url()).await;
        let pool = tmp.get_pool().await.clone();

        config.database.name = Uuid::new_v4().to_string();
        sqlx::query(&format!("CREATE DATABASE \"{}\"", config.database.name))
            .execute(&pool)
            .await
            .unwrap();

        let db = Database::new(&config.database_url()).await;
        let pool = db.get_pool().await;

        sqlx::migrate!().run(pool).await.unwrap();

        let state = AppState {
            pool: pool.to_owned(),
        };

        let app = create_router(state);

        TestApp {
            config,
            pool: pool.to_owned(),
            app,
        }
    }

    pub async fn drop_async(&self) {
        self.pool.close().await;

        let tmp = Database::new(&self.config.default_database_url()).await;
        let pool = tmp.get_pool().await.clone();

        sqlx::query(&format!("DROP DATABASE \"{}\"", &self.config.database.name))
            .execute(&pool)
            .await
            .unwrap();
    }
}

pub async fn create_user(t: &TestApp, payload: &CreateUserPayload) -> Response<Body> {
    t.app
        .to_owned()
        .oneshot(
            Request::builder()
                .method("POST")
                .header("Content-Type", "application/json")
                .uri("/api/users")
                .body(Body::from(serde_json::to_string(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap()
}
