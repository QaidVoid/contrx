import { z } from "zod";

export const APIError = z.object({
  errors: z.array(
    z.object({
      code: z.string(),
      message: z.string(),
    }),
  ),
});
