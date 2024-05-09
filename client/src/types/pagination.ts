import { z } from "zod";

export const PaginationQuery = z.object({
  page: z.number(),
  size: z.number(),
});

export type PaginationQuery = z.infer<typeof PaginationQuery>;

export const createPaginationSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) => {
  return z.object({
    data: z.array(dataSchema),
    total_count: z.number().int().nonnegative(),
  });
};
