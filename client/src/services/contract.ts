import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";
import { NewUserErrorResponse, NewUserPayload, NewUserResponse } from "../types/user";
import { NewContractPayload, NewContractResponse } from "../types/contract";
import { OrganizationPayload, NewOrganizationResponse } from "../types/organization";
import { ClausesResponse, NewClausePayload, NewClauseResponse } from "../types/clause";

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
  },
  createOrganization: {
    method: "POST",
    path: "/api/organizations",
    responses: {
      200: NewOrganizationResponse,
    },
    body: OrganizationPayload,
    summary: "Create new contract"
  },
  updateOrganization: {
    method: "PUT",
    path: "/api/organizations",
    responses: {
      200: NewOrganizationResponse,
    },
    body: NewOrganizationResponse,
    summary: "Create new contract"
  },
  getOrganization: {
    method: "GET",
    path: "/api/organizations/:organizationId",
    responses: {
      200: NewOrganizationResponse,
    },
    summary: "Get organization info"
  },
  createClause: {
    method: "POST",
    path: "/api/clauses",
    responses: {
      200: NewClauseResponse
    },
    body: NewClausePayload,
    summary: "Create new clause"
  },
  getClauses: {
    method: "GET",
    path: "/api/clauses/:organizationId",
    responses: {
      200: ClausesResponse,
    },
    summary: "Get organization info"
  },
  createContract: {
    method: "POST",
    path: "/api/contracts",
    responses: {
      200: NewContractResponse,
    },
    body: NewContractPayload,
    summary: "Create new contract"
  },
});
