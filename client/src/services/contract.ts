import { initContract } from "@ts-rest/core";
import { LoginPayload, LoginResponse } from "../types/auth";
import { ClauseResponse, NewClausePayload, NewClauseResponse } from "../types/clause";
import {
  Contract,
  ContractApproversInfo,
  ContractDocPayload,
  ContractTitlePayload,
  NewContractPayload,
  NewContractResponse,
} from "../types/contract";
import {
  ContactsList,
  ContactsListPayload,
  CounterParty,
  NewCounterPartyPayload,
  NewOrganizationResponse,
  OrganizationPayload,
  OrganizationsResponse,
  PaginatedCounterParties,
} from "../types/organization";
import { PaginationQuery, createPaginationSchema } from "../types/pagination";
import {
  InviteUser,
  InviteUserError,
  NewUserErrorResponse,
  NewUserPayload,
  NewUserResponse,
  PaginatedOrganizationUsers,
} from "../types/user";
import {
  ContractType,
  NewContractTypePayload,
  TemplateWithClause,
  TemplateWithClausePayload,
} from "../types/contract-type";

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
      422: NewUserErrorResponse,
    },
    body: NewUserPayload,
    summary: "Signup new user",
  },
  refreshToken: {
    method: "GET",
    path: "/api/auth/refresh_token",
    responses: {
      200: LoginResponse,
    },
    summary: "Refresh token",
  },
  logout: {
    method: "POST",
    path: "/api/auth/logout",
    responses: {
      200: null,
    },
    body: null,
    summary: "Logout",
  },
  createOrganization: {
    method: "POST",
    path: "/api/organizations",
    responses: {
      200: NewOrganizationResponse,
    },
    body: OrganizationPayload,
    summary: "Create new contract",
  },
  updateOrganization: {
    method: "PUT",
    path: "/api/organizations",
    responses: {
      200: NewOrganizationResponse,
    },
    body: NewOrganizationResponse,
    summary: "Create new contract",
  },
  getOrganization: {
    method: "GET",
    path: "/api/organizations/:organizationId",
    responses: {
      200: NewOrganizationResponse,
    },
    summary: "Get organization info",
  },
  getMyOrganizations: {
    method: "GET",
    path: "/api/organizations",
    responses: {
      200: OrganizationsResponse,
    },
    summary: "Get organizations of authenticated users",
  },
  getCounterParties: {
    method: "GET",
    path: "/api/organizations/:organizationId/counterparties",
    query: PaginationQuery,
    responses: {
      200: PaginatedCounterParties,
    },
  },
  createCounterParty: {
    method: "POST",
    path: "/api/organizations/:organizationId/counterparty",
    responses: {
      200: CounterParty,
    },
    body: NewCounterPartyPayload,
    summary: "Create counterparty",
  },
  updateCounterParty: {
    method: "PUT",
    path: "/api/organizations/counterparty",
    responses: {
      200: CounterParty,
    },
    body: CounterParty,
    summary: "Update counterparty",
  },
  createContact: {
    method: "POST",
    path: "/api/organizations/counterparty/:counterpartyId/contact",
    responses: {
      200: ContactsList,
    },
    body: ContactsListPayload,
    summary: "Create contact",
  },
  getContacts: {
    method: "GET",
    path: "/api/organizations/counterparty/:counterpartyId/contacts",
    responses: {
      200: ContactsList,
    },
    summary: "Get contacts",
  },
  createClause: {
    method: "POST",
    path: "/api/clauses",
    responses: {
      200: NewClauseResponse,
    },
    body: NewClausePayload,
    summary: "Create new clause",
  },
  updateClause: {
    method: "PUT",
    path: "/api/clauses",
    responses: {
      200: NewClauseResponse,
    },
    body: NewClauseResponse,
    summary: "Update clause",
  },
  getClauses: {
    method: "GET",
    path: "/api/clauses/org/:organizationId",
    query: PaginationQuery,
    responses: {
      200: createPaginationSchema(ClauseResponse),
    },
    summary: "Get organization info",
  },
  getClause: {
    method: "GET",
    path: "/api/clauses/:clauseId",
    responses: {
      200: ClauseResponse,
    },
    summary: "Get organization info",
  },
  createContractType: {
    method: "POST",
    path: "/api/templates",
    responses: {
      200: ContractType,
    },
    body: NewContractTypePayload,
  },
  getTemplates: {
    method: "GET",
    path: "/api/templates",
    query: PaginationQuery,
    responses: {
      200: createPaginationSchema(ContractType),
    },
    summary: "Get organization info",
  },
  getTemplate: {
    method: "GET",
    path: "/api/templates/:templateId",
    responses: {
      200: TemplateWithClause,
    },
    summary: "Get template",
  },
  updateTemplate: {
    method: "PUT",
    path: "/api/templates",
    body: TemplateWithClausePayload,
    responses: {
      200: null,
    },
    summary: "Update template",
  },
  createContract: {
    method: "POST",
    path: "/api/contracts",
    responses: {
      200: NewContractResponse,
    },
    body: NewContractPayload,
    summary: "Create new contract",
  },
  getContracts: {
    method: "GET",
    path: "/api/contracts/:organizationId",
    query: PaginationQuery,
    responses: {
      200: createPaginationSchema(Contract),
    },
    summary: "Get contracts",
  },
  getContract: {
    method: "GET",
    path: "/api/contracts/single/:contractId",
    responses: {
      200: Contract,
    },
    summary: "Get contract",
  },
  updateContractTitle: {
    method: "PATCH",
    path: "/api/contracts/title/:contractId",
    responses: {
      200: null,
    },
    body: ContractTitlePayload,
    summary: "Update contract title",
  },
  updateContractDoc: {
    method: "PATCH",
    path: "/api/contracts/doc/:contractId",
    responses: {
      200: null,
    },
    body: ContractDocPayload,
    summary: "Update document title",
  },
  publishContract: {
    method: "PATCH",
    path: "/api/contracts/publish/:contractId",
    responses: {
      200: null,
    },
    body: null,
    summary: "Publish contract",
  },
  getOrganizationUsers: {
    method: "GET",
    path: "/api/users/org/:organizationId",
    query: PaginationQuery,
    responses: {
      200: PaginatedOrganizationUsers,
    },
    summary: "Get organization info",
  },
  inviteOrganizationUser: {
    method: "POST",
    path: "/api/users/org/:organizationId",
    responses: {
      200: InviteUser,
      422: InviteUserError,
    },
    body: InviteUser,
    summary: "Get organization info",
  },
  getContractApprovers: {
    method: "GET",
    path: "/api/contracts/approvers/:contractId",
    responses: {
      200: ContractApproversInfo,
    },
    summary: "Get contract approvers",
  },
});
