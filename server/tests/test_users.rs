use axum::{
    body::Body,
    http::{Request, Response, StatusCode},
};
use contrx_server::domain::user::CreateUserPayload;
use tower::ServiceExt;

use crate::common::TestApp;

mod common;

async fn create_user(t: &TestApp, payload: &CreateUserPayload) -> Response<Body> {
    t.app
        .to_owned()
        .oneshot(
            Request::builder()
                .method("POST")
                .header("Content-Type", "application/json")
                .uri("/api/users")
                .body(Body::from(serde_json::to_string(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap()
}

#[tokio::test]
async fn create_user_should_return_error() {
    let t = TestApp::new().await;

    let mut payload = CreateUserPayload {
        email: "".into(),
        password: "".into(),
        first_name: "".into(),
        last_name: "".into(),
    };

    let res1 = create_user(&t, &payload).await;

    payload.email = "test".into();
    payload.password = "test123".into();
    payload.first_name = "test".into();
    payload.last_name = "test".into();
    let res2 = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res1.status(), StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(res2.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn create_user_should_return_ok() {
    let t = TestApp::new().await;

    let payload = CreateUserPayload {
        email: "test@mail.com".into(),
        password: "test123".into(),
        first_name: "Test".into(),
        last_name: "User".into(),
    };

    let res = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res.status(), StatusCode::OK);
}

#[tokio::test]
async fn create_user_should_return_ok_then_error() {
    let t = TestApp::new().await;

    let payload = CreateUserPayload {
        email: "test@mail.com".into(),
        password: "test123".into(),
        first_name: "Test".into(),
        last_name: "User".into(),
    };

    let res_first = create_user(&t, &payload).await;
    let res_second = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res_first.status(), StatusCode::OK);
    assert_eq!(res_second.status(), StatusCode::UNPROCESSABLE_ENTITY);
}
