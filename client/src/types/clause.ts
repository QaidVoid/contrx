import { z } from "zod";
import { createPaginationSchema } from "./pagination";

export const NewClausePayload = z.object({
  organization_id: z.string().optional(),
  title: z.string().trim(),
  name: z.string().trim(),
  type: z.string().trim(),
  language: z.string().trim(),
  is_default: z.boolean().default(false)
});


export type NewClausePayload = z.infer<typeof NewClausePayload>;

export const NewClauseResponse = NewClausePayload.extend({
  id: z.string()
});

export type NewClauseResponse = z.infer<typeof NewClauseResponse>;

export const ClauseResponse = NewClauseResponse.extend({
  organization_id: z.string(),
  last_modified_by: z.string(),
  last_modified_at: z.string()
});

export type ClauseResponse = z.infer<typeof ClauseResponse>;

export const PaginatedClausesResponse = createPaginationSchema(ClauseResponse);

export type PaginatedClausesResponse = z.infer<typeof PaginatedClausesResponse>;
