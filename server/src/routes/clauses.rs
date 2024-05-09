use axum::{
    extract::{Path, Query, State},
    middleware,
    routing::{delete, get, post, put},
    Extension, Json, Router,
};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::{
    domain::{
        clause::{
            Clause, CreateClause, CreateClausePayload, EditClause, EditClausePayload,
            OrganizationClause,
        },
        pagination::{PageCount, PaginatedResponse, Pagination},
    },
    error::Error,
    middleware::auth::auth_middleware,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn clauses_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_clause))
        .route("/org/:organization_id", get(get_clauses))
        .route("/:clause_id", delete(remove_clause))
        .route("/", put(update_clause))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}

#[axum::debug_handler]
async fn create_clause(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<CreateClausePayload>,
) -> Result<Clause> {
    let sid = session_id.0;

    let create_clause = CreateClause::try_from(payload)?;

    let mut tx = state.pool.begin().await?;

    let clause = sqlx::query_as!(
        Clause,
        r#"
    INSERT INTO clauses (title, name, type, language, is_default, last_modified_by, last_modified_at)
    VALUES ($1, $2, $3, $4, $5, (SELECT user_id FROM sessions WHERE id=$6), $7)
    RETURNING *
    "#,
        create_clause.title,
        create_clause.name,
        create_clause.r#type,
        create_clause.language,
        create_clause.is_default,
        sid,
        OffsetDateTime::now_utc()
    )
    .fetch_one(&mut *tx)
    .await?;
    println!("CLAUSE: {:?}", clause);

    sqlx::query!(
        r#"
    INSERT INTO organizations_clauses (organization_id, clause_id)
    VALUES
    ($1, $2)
    "#,
        create_clause.organization_id,
        clause.id
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(Json(clause))
}

#[axum::debug_handler]
async fn get_clauses(
    pagination: Query<Pagination>,
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<OrganizationClause>> {
    let pages = sqlx::query_as!(
        PageCount,
        r#"
            SELECT COUNT(*) AS total_count
            FROM organizations_clauses oc
            JOIN organizations o ON oc.organization_id = o.id
            WHERE o.id = $1
        "#,
        organization_id
    )
    .fetch_one(&state.pool)
    .await?;

    let clauses = sqlx::query_as!(
        OrganizationClause,
        r#"
        SELECT c.id, c.title, c.name, c.type, c.language, c.is_default, c.last_modified_at, o.id as organization_id, concat_ws(' ', u.first_name, u.last_name) as last_modified_by
        FROM organizations_clauses oc
        JOIN organizations o
        ON oc.organization_id = o.id
        JOIN clauses c
        ON oc.clause_id = c.id
        JOIN users u
        ON u.id = c.last_modified_by
        WHERE o.id = $1
        LIMIT $2
        OFFSET $3
    "#,
        organization_id,
        pagination.size,
        (pagination.page - 1) * pagination.size
    )
    .fetch_all(&state.pool)
    .await
    .map_err(Error::from)?;

    Ok(Json(PaginatedResponse {
        data: clauses,
        total_count: pages.total_count,
    }))
}

#[axum::debug_handler]
async fn update_clause(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<EditClausePayload>,
) -> Result<Clause> {
    let sid = session_id.0;

    let edit_clause = EditClause::try_from(payload)?;

    let clause = sqlx::query_as!(
        Clause,
        r#"
    UPDATE clauses SET
        title=$1,
        name=$2,
        type=$3,
        language=$4,
        last_modified_by=(SELECT user_id FROM sessions WHERE id=$5),
        last_modified_at=$6
    WHERE id=$7
    RETURNING *
    "#,
        edit_clause.title,
        edit_clause.name,
        edit_clause.r#type,
        edit_clause.language,
        sid,
        OffsetDateTime::now_utc(),
        edit_clause.id
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(clause))
}

#[axum::debug_handler]
async fn remove_clause(Path(clause_id): Path<Uuid>, State(state): State<AppState>) -> Result<()> {
    sqlx::query!("DELETE FROM clauses WHERE id=$1", clause_id)
        .execute(&state.pool)
        .await?;

    Ok(Json(()))
}
