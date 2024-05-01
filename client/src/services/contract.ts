import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";

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
});
