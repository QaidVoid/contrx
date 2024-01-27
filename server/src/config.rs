use std::fs;

use serde::Deserialize;

#[derive(Deserialize)]
pub struct App {
    pub host: String,
    pub port: u16,
}

#[derive(Deserialize, Clone)]
pub struct Database {
    pub name: String,
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct Config {
    pub app: App,
    pub database: Database,
}

impl Config {
    pub fn new() -> Self {
        let file = fs::read("config.yaml").unwrap();
        serde_yaml::from_slice(&file).unwrap_or_else(|e| panic!("{:#?}", e.to_string()))
    }

    pub fn database_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}",
            self.database.user,
            self.database.password,
            self.database.host,
            self.database.port,
            self.database.name
        )
    }

    pub fn default_database_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/postgres",
            self.database.user, self.database.password, self.database.host, self.database.port,
        )
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}
