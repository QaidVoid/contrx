use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct Pagination {
    pub page: i64,
    pub size: i64
}


#[derive(Deserialize, Serialize)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub total_count: Option<i64>
}

pub struct PageCount {
    pub total_count: Option<i64>
}
