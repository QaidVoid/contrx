import { z } from "zod";
import { createPaginationSchema } from "./pagination";

export const NewContractForm = z.object({
  organization_id: z.string(),
  contract_type_id: z.string(),
  title: z.string().trim(),
  description: z.string().trim(),
  effective_date: z.date(),
  end_date: z.date(),
  counterparty_id: z.string(),
});

export type NewContractForm = z.infer<typeof NewContractForm>;

export const NewContractPayload = z.object({
  organization_id: z.string(),
  contract_type_id: z.string(),
  title: z.string().trim(),
  description: z.string().trim(),
  effective_date: z.array(z.number()),
  end_date: z.array(z.number()),
  counterparty_id: z.string(),
});

export type NewContractPayload = z.infer<typeof NewContractPayload>;

export const NewContractResponse = NewContractPayload;

export type NewContractResponse = z.infer<typeof NewContractResponse>;

export const Contract = z.object({
  id: z.string(),
  contract_type_id: z.string(),
  organization_id: z.string(),
  contract_owner: z.string(),
  title: z.string(),
  description: z.string(),
  definite_term: z.boolean(),
  counterparty_id: z.string(),
  counterparty_name: z.string(),
  effective_date: z.array(z.number()),
  end_date: z.array(z.number()),
  renewable: z.boolean(),
  status: z.string(),
  document: z.any(),
});

export type Contract = z.infer<typeof Contract>;

export const PaginatedContracts = createPaginationSchema(Contract);

export type PaginatedContracts = z.infer<typeof PaginatedContracts>;

export const ContractTitlePayload = z.object({
  title: z.string(),
});

export type ContractTitlePayload = z.infer<typeof ContractTitlePayload>;

export const ContractDocPayload = z.object({
  document: z.any(),
});

export type ContractDocPayload = z.infer<typeof ContractDocPayload>;

export const ContractApprovers = z.object({
  contract_id: z.string(),
  approvers: z.array(z.object({
    key: z.string(),
    id: z.string()
  })),
});

export type ContractApprovers = z.infer<typeof ContractApprovers>;

export const ContractApproversInfo = z.array(
  z.object({
    contract_id: z.string(),
    approver_id: z.string(),
    approver_name: z.string(),
    approval_status: z.string(),
  }),
);

export type ContractApproversInfo = z.infer<typeof ContractApproversInfo>;

export const ProbableApprovers = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type ProbableApprovers = z.infer<typeof ProbableApprovers>;

export const UpdateContractStatusPayload = z.object({
  contract_id: z.string(),
  approver_id: z.string(),
  status: z.string()
});

export type UpdateContractStatusPayload = z.infer<typeof UpdateContractStatusPayload>;
