use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt;

use crate::common::TestApp;

#[tokio::test]
async fn health_should_be_ok() {
    let t = TestApp::new().await;

    let res = t
        .app
        .to_owned()
        .oneshot(
            Request::builder()
                .uri("/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    t.drop_async().await;

    assert_eq!(res.status(), StatusCode::OK);
}
