import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";
import { NewUserErrorResponse, NewUserPayload, NewUserResponse } from "../types/user";

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
      422: NewUserErrorResponse
    },
    body: NewUserPayload,
    summary: "Signup new user"
  },
  refreshToken: {
    method: "GET",
    path: "/api/auth/refresh_token",
    responses: {
      200: LoginResponse,
    },
    summary: "Refresh token"
  },
  logout: {
    method: "POST",
    path: "/api/auth/logout",
    responses: {
      200: null
    },
    body: null,
    summary: "Logout"
  }
});
