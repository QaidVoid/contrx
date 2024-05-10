import { z } from "zod";

export const NewContractTypePayload = z
  .object({
    name: z.string(),
    category: z.string(),
    intent: z.string(),
    party_a_is_self: z.string().transform((v) => v === "My Organization"),
    party_b_is_self: z.string().transform((v) => v === "My Organization"),
  })
  .refine(
    (data) => data.party_a_is_self !== data.party_b_is_self,
    "Party A and Party B cannot be the same",
  );

export type NewContractTypePayload = z.infer<typeof NewContractTypePayload>;
