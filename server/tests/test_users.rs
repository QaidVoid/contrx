use axum::http::StatusCode;
use contrx_server::domain::user::CreateUserPayload;

use crate::common::{create_user, mock, TestApp};

mod common;

#[tokio::test]
async fn create_user_should_return_error() {
    let t = TestApp::new().await;

    let mut payload = CreateUserPayload {
        email: "".into(),
        password: "".into(),
        confirm_password: "".into(),
        first_name: "".into(),
        last_name: "".into(),
    };

    let res1 = create_user(&t, &payload).await;

    payload = CreateUserPayload {
        email: "test".into(),
        password: "test123".into(),
        confirm_password: "test12".into(),
        first_name: "test".into(),
        last_name: "test".into(),
    };
    let res2 = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res1.status(), StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(res2.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn create_user_should_return_ok() {
    let t = TestApp::new().await;

    let payload = mock::new_user();

    let res = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res.status(), StatusCode::OK);
}

#[tokio::test]
async fn create_user_should_return_ok_then_error() {
    let t = TestApp::new().await;

    let payload = mock::new_user();

    let res_first = create_user(&t, &payload).await;
    let res_second = create_user(&t, &payload).await;

    t.drop_async().await;

    assert_eq!(res_first.status(), StatusCode::OK);
    assert_eq!(res_second.status(), StatusCode::UNPROCESSABLE_ENTITY);
}
