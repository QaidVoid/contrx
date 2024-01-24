use std::{env, error::Error};

use contrx_server::{database::Database, run};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv().expect("Failed to load .env file.");

    let db = Database::new(&env::var("DATABASE_URL")?).await;

    let pool = db.get_pool().await;

    run(pool).await;

    Ok(())
}
