import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";
import { NewUserPayload, NewUserResponse } from "../types/user";

const c = initContract();

export const contract = c.router({
  login: {
    method: "POST",
    path: "/api/auth/login",
    responses: {
      200: LoginResponse,
    },
    body: LoginPayload,
    summary: "Login user",
  },
  signup: {
    method: "POST",
    path: "/api/users",
    responses: {
      200: NewUserResponse,
    },
    body: NewUserPayload,
    summary: "Signup new user"
  },
  refreshToken: {
    method: "POST",
    path: "api/auth/refresh_token",
    responses: {
      200: LoginResponse,
    },
    body: null,
    summary: "Refresh token"
  }
});
