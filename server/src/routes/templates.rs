use axum::{extract::State, middleware, routing::post, Json, Router};

use crate::{
    domain::template::{CreateTemplate, CreateTemplatePayload, Template},
    error::Error,
    middleware::auth::auth_middleware,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn templates_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_template))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}

async fn create_template(
    State(state): State<AppState>,
    Json(payload): Json<CreateTemplatePayload>,
) -> Result<Template> {
    let create_template = CreateTemplate::try_from(payload)?;

    let template = sqlx::query_as!(
        Template,
        r#"
        INSERT INTO contract_types (name, category, intent, party_a_is_self, party_b_is_self, status)
        VALUES ($1, $2, $3, $4, $5, 'Draft')
        RETURNING *
        "#,
        create_template.name,
        create_template.category,
        create_template.intent,
        create_template.party_a_is_self,
        create_template.party_b_is_self
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(template))
}
