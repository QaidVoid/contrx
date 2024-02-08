use std::error::Error;

use contrx_server::{config::CONFIG, database::Database, run};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let db = Database::new(&CONFIG.database_url()).await;
    println!("Database connection established...");

    let pool = db.get_pool().await;

    run(&CONFIG, pool).await;

    Ok(())
}
