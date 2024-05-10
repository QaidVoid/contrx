import { z } from "zod";
import { createPaginationSchema } from "./pagination";
import { ClauseResponse } from "./clause";

export const NewContractTypeForm = z
  .object({
    name: z.string(),
    category: z.string(),
    intent: z.string(),
    party_a: z.string(),
    party_b: z.string(),
  })
  .refine((data) => data.party_a !== data.party_b, "Party A and Party B cannot be the same");

export type NewContractTypeForm = z.infer<typeof NewContractTypeForm>;

export const ContractType = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  intent: z.string(),
  party_a_is_self: z.boolean(),
  party_b_is_self: z.boolean(),
  status: z.string(),
});

export type ContractType = z.infer<typeof ContractType>;

export const NewContractTypePayload = ContractType.omit({ id: true, status: true });

export type NewContractTypePayload = z.infer<typeof NewContractTypePayload>;

export function parseContractType(data: NewContractTypeForm): NewContractTypePayload {
  const selfIdentifier = "My Organization";

  return {
    name: data.name,
    category: data.category,
    intent: data.intent,
    party_a_is_self: data.party_a === selfIdentifier,
    party_b_is_self: data.party_b === selfIdentifier,
  };
}

export const TemplateClause = z.object({
  id: z.string(),
  contract_type_id: z.string(),
  clause_id: z.string(),
  clause_order: z.number(),
});

export const TemplateClausePayload = TemplateClause.omit({ id: true, contract_type_id: true });

export const TemplateWithClausePayload = z.object({
  contract_type: ContractType,
  clauses: z.array(ClauseResponse),
});

export type TemplateWithClausePayload = z.infer<typeof TemplateWithClausePayload>;

export const TemplateWithClause = z.object({
  contract_type: ContractType,
  clauses: z.array(ClauseResponse),
});

export type TemplateWithClause = z.infer<typeof TemplateWithClause>;

export const PaginatedContractTypes = createPaginationSchema(ContractType);

export type PaginatedContractTypes = z.infer<typeof PaginatedContractTypes>;
