import { z } from "zod";

export const NewContractTypePayload = z.object({
  name: z.string(),
  category: z.string(),
  intent: z.string(),
  party_a_is_self: z.string().refine(v => v === "My Organization"),
  party_b_is_self: z.string().refine(v => v === "My Organization")
})

export type NewContractTypePayload = z.infer<typeof NewContractTypePayload>;
