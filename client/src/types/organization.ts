import { z } from "zod";

export const OrganizationPayload = z.object({
  name: z.string().trim(),
  country: z.string().trim(),
});

export type OrganizationPayload = z.infer<typeof OrganizationPayload>;

export const NewOrganizationResponse = OrganizationPayload.extend({
  id: z.string(),
});

export type NewOrganizationResponse = z.infer<typeof NewOrganizationResponse>;

export const OrganizationsResponse = z.array(NewOrganizationResponse);

export type OrganizationsResponse = z.infer<typeof OrganizationsResponse>;
