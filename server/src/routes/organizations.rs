use axum::{
    extract::{Path, State},
    middleware,
    routing::{get, post, put},
    Extension, Json, Router,
};
use uuid::Uuid;

use crate::{
    domain::organization::{
        CreateOrganization, CreateOrganizationPayload, EditOrganization, EditOrganizationPayload,
        Organization,
    },
    error::Error,
    middleware::auth::auth_middleware,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn organizations_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_organization))
        .route("/", put(update_organization))
        .route("/:organization_id", get(get_organization))
        .route("/", get(get_organizations))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}

#[axum::debug_handler]
async fn create_organization(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<CreateOrganizationPayload>,
) -> Result<Organization> {
    let sid = session_id.0;

    let organization = CreateOrganization::try_from(payload)?;

    let mut tx = state.pool.begin().await?;

    let organization = sqlx::query_as!(
        Organization,
        r#"
    INSERT INTO organizations (name, country)
    VALUES ($1, $2)
    RETURNING id, name, country
    "#,
        organization.name,
        organization.country
    )
    .fetch_one(&mut *tx)
    .await?;

    sqlx::query!(
        r#"
    INSERT INTO users_organizations (user_id, organization_id, role, status)
    VALUES
    ((SELECT user_id FROM sessions WHERE id=$1), $2, $3, $4)
    "#,
        sid,
        organization.id,
        "admin",
        "active"
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(Json(organization))
}

#[axum::debug_handler]
async fn update_organization(
    State(state): State<AppState>,
    Json(payload): Json<EditOrganizationPayload>,
) -> Result<EditOrganization> {
    let organization = EditOrganization::try_from(payload)?;

    sqlx::query!(
        r#"
    UPDATE organizations SET name=$2, country=$3 WHERE id=$1
    "#,
        organization.id,
        organization.name,
        organization.country
    )
    .execute(&state.pool)
    .await
    .map_err(Error::from)?;

    Ok(Json(organization))
}

#[axum::debug_handler]
async fn get_organization(
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Organization> {
    let organization = sqlx::query_as!(
        Organization,
        r#"
        SELECT id,name,country FROM organizations WHERE id=$1
    "#,
        organization_id
    )
    .fetch_one(&state.pool)
    .await
    .map_err(Error::from)?;

    Ok(Json(organization))
}

#[axum::debug_handler]
async fn get_organizations(
    session_id: Extension<Uuid>,
    State(state): State<AppState>,
) -> Result<Vec<Organization>> {
    let sid = session_id.0;

    let organizations = sqlx::query_as!(
        Organization,
        r#"
            SELECT o.id,o.name,o.country
            FROM sessions s
            JOIN users_organizations uo ON s.user_id = uo.user_id
            JOIN organizations o ON uo.organization_id = o.id
            WHERE s.id = $1;
        "#,
        sid
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(organizations))
}
