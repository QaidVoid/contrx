import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";
import { ClauseResponse, NewClausePayload, NewClauseResponse } from "../types/clause";
import { NewContractPayload, NewContractResponse } from "../types/contract";
import { NewOrganizationResponse, OrganizationPayload, OrganizationsResponse } from "../types/organization";
import { PaginationQuery, createPaginationSchema } from "../types/pagination";
import { NewUserErrorResponse, NewUserPayload, NewUserResponse } from "../types/user";
import { ContractType, NewContractTypePayload, TemplateWithClause, TemplateWithClausePayload } from "../types/contract-type";

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
  getMyOrganizations: {
    method: "GET",
    path: "/api/organizations",
    responses: {
      200: OrganizationsResponse
    },
    summary: "Get organizations of authenticated users"
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
  updateClause: {
    method: "PUT",
    path: "/api/clauses",
    responses: {
      200: NewClauseResponse
    },
    body: NewClauseResponse,
    summary: "Update clause"
  },
  getClauses: {
    method: "GET",
    path: "/api/clauses/org/:organizationId",
    query: PaginationQuery,
    responses: {
      200: createPaginationSchema(ClauseResponse),
    },
    summary: "Get organization info"
  },
  getClause: {
    method: "GET",
    path: "/api/clauses/:clauseId",
    responses: {
      200: ClauseResponse
    },
    summary: "Get organization info"
  },
  createContractType: {
    method: "POST",
    path: "/api/templates",
    responses: {
      200: ContractType
    },
    body: NewContractTypePayload
  },
  getTemplates: {
    method: "GET",
    path: "/api/templates",
    query: PaginationQuery,
    responses: {
      200: createPaginationSchema(ContractType),
    },
    summary: "Get organization info"
  },
  getTemplate: {
    method: "GET",
    path: "/api/templates/:templateId",
    responses: {
      200: TemplateWithClause
    },
    summary: "Get template"
  },
  updateTemplate: {
    method: "PUT",
    path: "/api/templates",
    body: TemplateWithClausePayload,
    responses: {
      200: null
    },
    summary: "Update template"
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
