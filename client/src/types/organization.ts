import { z } from "zod";
import { createPaginationSchema } from "./pagination";

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

export const CounterParty = z.object({
  id: z.string(),
  organization_id: z.string(),
  name: z.string(),
  type: z.string(),
});

export type CounterParty = z.infer<typeof CounterParty>;

export const NewCounterPartyPayload = z.object({
  name: z.string(),
  type: z.string(),
});

export type NewCounterPartyPayload = z.infer<typeof NewCounterPartyPayload>;

export const PaginatedCounterParties = createPaginationSchema(CounterParty);

export type PaginatedCounterParties = z.infer<typeof PaginatedCounterParties>;

export const ContactPayload = z.object({
  full_name: z.string(),
  email: z.string(),
});

export type ContactPayload = z.infer<typeof ContactPayload>;

export const ContactsListPayload = z.array(ContactPayload);

export type ContactsListPayload = z.infer<typeof ContactsListPayload>;

export const ContactsListForm = z.object({
  contacts: z.array(
    ContactPayload.extend({
      key: z.string(),
    }),
  ),
});

export type ContactsListForm = z.infer<typeof ContactsListForm>;

export const ContactsList = z.array(
  ContactPayload.extend({
    id: z.string(),
    counterparty_id: z.string(),
  }),
);

export type ContactsList = z.infer<typeof ContactsList>;
