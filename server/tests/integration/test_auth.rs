use axum::{
    body::Body,
    http::{Request, Response, StatusCode},
};
use contrx_server::domain::auth::LoginPayload;
use tower::ServiceExt;

use crate::common::{create_user, mock, TestApp};

pub async fn login(t: &TestApp, payload: &LoginPayload) -> Response<Body> {
    t.app
        .to_owned()
        .oneshot(
            Request::builder()
                .method("POST")
                .header("Content-Type", "application/json")
                .uri("/api/auth/login")
                .body(Body::from(serde_json::to_string(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap()
}

#[tokio::test]
async fn login_should_fail() {
    let t = TestApp::new().await;

    let payload = mock::new_user();

    create_user(&t, &payload).await;

    let payload = LoginPayload {
        email: format!("fail-{}", payload.email),
        password: format!("fail-{}", payload.password),
    };

    let res = login(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn login_should_return_ok() {
    let t = TestApp::new().await;

    let payload = mock::new_user();

    create_user(&t, &payload).await;

    let payload = LoginPayload {
        email: payload.email,
        password: payload.password,
    };

    let res = login(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res.status(), StatusCode::OK);
}
