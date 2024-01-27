use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

pub struct Database {
    pool: Pool<Postgres>,
}

impl Database {
    pub async fn new(url: &str) -> Self {
        let pool = PgPoolOptions::new().max_connections(30).connect(url).await;

        match pool {
            Ok(pool) => Self { pool },
            Err(e) => {
                eprintln!("{e}");
                panic!("Failed to connect to the database.");
            }
        }
    }

    pub async fn get_pool(&self) -> &Pool<Postgres> {
        &self.pool
    }
}
