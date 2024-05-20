use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use axum::{
    extract::{Path, Query, State},
    routing::{get, post},
    Json, Router,
};
use uuid::Uuid;

use crate::{
    domain::{
        pagination::{PaginatedResponse, Pagination},
        user::{CreateUser, CreateUserPayload, NewUser, OrgUser},
    },
    error::Error,
    AppState,
};

type Result<T> = std::result::Result<Json<T>, Error>;

pub fn users_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_user))
        .route("/org/:organization_id", get(get_users))
        .route("/org/:organization_id", post(invite_user))
}

#[axum::debug_handler]
async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserPayload>,
) -> Result<CreateUser> {
    let user = CreateUser::try_from(payload)?;
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(user.password.as_ref().as_bytes(), &salt)
        .map_err(Error::from)?
        .to_string();

    sqlx::query!(
        r#"
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    "#,
        user.email.as_ref(),
        password_hash,
        user.first_name.as_ref(),
        user.last_name.as_ref()
    )
    .execute(&state.pool)
    .await
    .map_err(Error::from)?;

    Ok(Json(user))
}

#[axum::debug_handler]
async fn get_users(
    pagination: Query<Pagination>,
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<PaginatedResponse<OrgUser>> {
    let records = sqlx::query!(
        r#"
        SELECT COUNT(*) as total_count
        FROM
        users_organizations
        WHERE organization_id=$1
    "#,
        organization_id
    )
    .fetch_one(&state.pool)
    .await?;

    let users = sqlx::query_as!(
        OrgUser,
        r#"
            SELECT u.id, u.email, u.first_name, u.last_name, uo.status, uo.role FROM users_organizations uo
            JOIN users u
            ON u.id = uo.user_id
            WHERE uo.organization_id=$1
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
        data: users,
        total_count: records.total_count,
    }))
}

#[axum::debug_handler]
async fn invite_user(
    Path(organization_id): Path<Uuid>,
    State(state): State<AppState>,
    Json(payload): Json<NewUser>,
) -> Result<NewUser> {
    let user = sqlx::query!("SELECT id FROM users WHERE email=$1", payload.email)
        .fetch_optional(&state.pool)
        .await?;

    if user.is_none() {
        let mut builder = Error::builder();
        let error = ("user_not_found", "User doesn't exist");
        builder.error(error);
        return Err(builder.build());
    }

    let user = user.unwrap();

    let org_user = sqlx::query!(
        "SELECT id FROM users_organizations WHERE user_id=$1 AND organization_id=$2",
        user.id,
        organization_id
    )
    .fetch_optional(&state.pool)
    .await?;

    if org_user.is_some() {
        let mut builder = Error::builder();
        builder.error(("already_invited", "User is already invited"));
        return Err(builder.build());
    }

    sqlx::query!(
        r#"
            INSERT INTO users_organizations
            (user_id, organization_id, role, status)
            VALUES
            ($1, $2, $3, 'Invited')
        "#,
        user.id,
        organization_id,
        payload.role
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(payload))
}
