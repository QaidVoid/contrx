use std::error::Error;

use contrx_server::{config::Config, database::Database, run};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let config = Config::default();

    let db = Database::new(&config.database_url()).await;
    println!("Database connection established...");

    let pool = db.get_pool().await;

    run(&config, pool).await;

    Ok(())
}
