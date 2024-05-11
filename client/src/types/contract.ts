import { z } from "zod";

export const NewContractPayload = z.object({
  contract_type: z.string(),
  title: z.string().trim(),
  description: z.string().trim(),
  effective_date: z.date(),
  expiry_date: z.date(),
  counterparty: z.string()
});

export type NewContractPayload = z.infer<typeof NewContractPayload>;

export const NewContractResponse = NewContractPayload;

export type NewContractResponse = z.infer<typeof NewContractResponse>;
