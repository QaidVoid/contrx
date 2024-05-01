import { z } from "zod";

export const LoginPayload = z.object({
  email: z.string(),
  password: z.string(),
});

export const LoginResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});
