use axum::{extract::State, middleware, routing::get, Extension, Json, Router};
use uuid::Uuid;

use crate::{
    domain::notification::Notification, error::Error, middleware::auth::auth_middleware, AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn notifications_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(get_notifications))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}

#[axum::debug_handler]
async fn get_notifications(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
) -> Result<Vec<Notification>> {
    let notifications = sqlx::query_as!(
        Notification,
        r#"
            SELECT * FROM notifications
            WHERE
            user_id=(SELECT user_id FROM sessions WHERE id=$1)
        "#,
        session_id.0
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(notifications))
}
