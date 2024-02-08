use contrx_server::domain::user::CreateUserPayload;
use fake::{
    faker::{
        internet::en::{Password, SafeEmail},
        name::en::{FirstName, LastName},
    },
    Fake,
};

pub fn new_user() -> CreateUserPayload {
    let email = SafeEmail().fake();
    let password: String = Password(8..24).fake();
    let first_name = FirstName().fake();
    let last_name = LastName().fake();

    CreateUserPayload {
        email,
        password: password.to_owned(),
        confirm_password: password,
        first_name,
        last_name,
    }
}
