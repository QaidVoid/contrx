use axum::{
    extract::{Path, Query, State},
    middleware,
    routing::{get, post, put},
    Extension, Json, Router,
};
use uuid::Uuid;

use crate::{
    domain::{
        organization::{
            Contact, CounterParty, CreateContactPayload, CreateCounterPartyPayload,
            CreateOrganization, CreateOrganizationPayload, EditOrganization,
            EditOrganizationPayload, Organization,
        },
        pagination::{PageCount, PaginatedResponse, Pagination},
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
        .route("/:organization_id/counterparty", post(create_counterparty))
        .route("/counterparty", put(update_counterparty))
        .route("/:organization_id/counterparties", get(get_counterparties))
        .route(
            "/counterparty/:counterparty_id/contact",
            post(create_contact),
        )
        .route("/counterparty/:counterparty_id/contacts", get(get_contacts))
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

#[axum::debug_handler]
async fn create_counterparty(
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<CreateCounterPartyPayload>,
) -> Result<CounterParty> {
    let counterparty = sqlx::query_as!(
        CounterParty,
        r#"
            INSERT INTO counterparties
            (organization_id, name, type)
            VALUES
            ($1, $2, $3)
            RETURNING *
        "#,
        organization_id,
        payload.name,
        payload.r#type,
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(counterparty))
}

#[axum::debug_handler]
async fn update_counterparty(
    State(state): State<AppState>,
    Json(payload): Json<CounterParty>,
) -> Result<CounterParty> {
    let counterparty = sqlx::query_as!(
        CounterParty,
        r#"
            UPDATE counterparties
            SET
            name=$2, type=$3
            WHERE id=$1
            RETURNING *
        "#,
        payload.id,
        payload.name,
        payload.r#type,
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(counterparty))
}

#[axum::debug_handler]
async fn get_counterparties(
    pagination: Query<Pagination>,
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<CounterParty>> {
    let pages = sqlx::query_as!(
        PageCount,
        r#"
            SELECT COUNT(*) as total_count
            FROM counterparties
            WHERE organization_id=$1
        "#,
        organization_id
    )
    .fetch_one(&state.pool)
    .await?;

    let counterparty = sqlx::query_as!(
        CounterParty,
        r#"
            SELECT *
            FROM counterparties
            WHERE organization_id=$1
            LIMIT $2
            OFFSET $3
        "#,
        organization_id,
        pagination.size,
        (pagination.page - 1) * pagination.size
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(PaginatedResponse {
        data: counterparty,
        total_count: pages.total_count,
    }))
}

#[axum::debug_handler]
async fn create_contact(
    Path(counterparty_id): Path<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<Vec<CreateContactPayload>>,
) -> Result<Vec<Contact>> {
    let mut contacts: Vec<Contact> = Vec::new();

    // FIXME: remove this and do proper updating
    sqlx::query!(
        "DELETE FROM contacts WHERE counterparty_id=$1",
        counterparty_id
    )
    .execute(&state.pool)
    .await?;

    for contact in payload {
        let exists = sqlx::query!(
            "SELECT id FROM contacts WHERE counterparty_id=$1 AND email=$2",
            counterparty_id,
            contact.email
        )
        .fetch_optional(&state.pool)
        .await?;

        if exists.is_some() {
            let contact = sqlx::query_as!(
                Contact,
                r#"
                UPDATE contacts
                SET
                full_name=$3
                WHERE counterparty_id=$1 AND email=$2
                RETURNING *
            "#,
                counterparty_id,
                contact.email,
                contact.full_name
            )
            .fetch_one(&state.pool)
            .await?;

            contacts.push(contact);
        } else {
            let contact = sqlx::query_as!(
                Contact,
                r#"
                INSERT INTO contacts (counterparty_id, email, full_name)
                VALUES
                ($1, $2, $3)
                RETURNING *
            "#,
                counterparty_id,
                contact.email,
                contact.full_name
            )
            .fetch_one(&state.pool)
            .await?;

            contacts.push(contact);
        }
    }

    Ok(Json(contacts))
}

#[axum::debug_handler]
async fn get_contacts(
    Path(counterparty_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Vec<Contact>> {
    let contacts = sqlx::query_as!(
        Contact,
        r#"
            SELECT * FROM contacts WHERE counterparty_id=$1
        "#,
        counterparty_id
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(contacts))
}
