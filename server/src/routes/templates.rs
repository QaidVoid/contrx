use axum::{
    extract::{Path, Query, State},
    middleware,
    routing::{get, post, put},
    Json, Router,
};

use crate::{
    domain::{
        clause::OrganizationClause,
        pagination::{PageCount, PaginatedResponse, Pagination},
        template::{
            CreateTemplate, CreateTemplatePayload, Template, TemplateWithClauses,
        },
    },
    error::Error,
    middleware::auth::auth_middleware,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn templates_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_template))
        .route("/:template_id", get(get_template))
        .route("/", get(get_templates))
        .route("/", put(update_template))
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

async fn get_template(
    Path(template_id): Path<uuid::Uuid>,
    State(state): State<AppState>,
) -> Result<TemplateWithClauses> {
    let mut tx = state.pool.begin().await?;

    let contract_type = sqlx::query_as!(
        Template,
        r#"
        SELECT id, name, category, intent, party_a_is_self, party_b_is_self, status
        FROM contract_types
        WHERE id = $1
        "#,
        template_id
    )
    .fetch_one(&mut *tx)
    .await?;

    let clauses = sqlx::query_as!(
        OrganizationClause,
        r#"
        SELECT
            c.id,
            oc.organization_id,
            c.title,
            c.name,
            c.type,
            c.language,
            c.is_default,
            u.email as last_modified_by,
            c.last_modified_at
        FROM clauses c
        JOIN contract_clauses cc ON c.id = cc.clause_id
        JOIN contract_types ct ON cc.contract_type_id = ct.id
        LEFT JOIN organizations_clauses oc ON c.id = oc.clause_id
        LEFT JOIN users u ON c.last_modified_by = u.id
        WHERE ct.id = $1
        ORDER BY cc.clause_order
    "#,
        template_id
    )
    .fetch_all(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(Json(TemplateWithClauses {
        contract_type,
        clauses,
    }))
}

async fn get_templates(
    pagination: Query<Pagination>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<Template>> {
    let pages = sqlx::query_as!(
        PageCount,
        r#"
        SELECT COUNT(*) AS total_count
        FROM contract_types
        "#
    )
    .fetch_one(&state.pool)
    .await?;

    let data = sqlx::query_as!(
        Template,
        r#"
        SELECT id, name, category, intent, party_a_is_self, party_b_is_self, status
        FROM contract_types
        LIMIT $1
        OFFSET $2
        "#,
        pagination.size,
        (pagination.page - 1) * pagination.size
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(PaginatedResponse {
        data,
        total_count: pages.total_count,
    }))
}

async fn update_template(
    State(state): State<AppState>,
    Json(payload): Json<TemplateWithClauses>,
) -> Result<()> {
    let mut tx = state.pool.begin().await?;

    sqlx::query!(
        "DELETE FROM contract_clauses WHERE contract_type_id=$1",
        payload.contract_type.id
    )
    .execute(&mut *tx)
    .await?;

    for (i, v) in payload.clauses.iter().enumerate() {
        sqlx::query!(
            r#"INSERT INTO contract_clauses
            (contract_type_id, clause_id, clause_order)
            VALUES
            ($1, $2, $3)"#,
            payload.contract_type.id,
            v.id,
            i as i32
        )
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;

    Ok(Json(()))
}
