import { z } from "zod";
import { createPaginationSchema } from "./pagination";
import { dateToOffset } from "../lib";

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
  organization: z.string(),
  title: z.string(),
  description: z.string(),
  definite_term: z.boolean(),
  counterparty_id: z.string(),
  counterparty_name: z.string(),
  effective_date: z.array(z.number()),
  end_date: z.array(z.number()),
  renewable: z.boolean(),
  status: z.string(),
});

export type Contract = z.infer<typeof Contract>;

export const PaginatedContracts = createPaginationSchema(Contract);

export type PaginatedContracts = z.infer<typeof PaginatedContracts>;
