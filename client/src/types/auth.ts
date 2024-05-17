import { z } from "zod";

export const AuthUser = z.object({
  id: z.number(),
});

export type AuthUser = z.infer<typeof AuthUser>;

export const LoginPayload = z.object({
  email: z.string({
    required_error: "Email is required"
  }).email({
    message: "Invalid email"
  }),
  password: z.string().trim(),
});

export type LoginPayload = z.infer<typeof LoginPayload>;

export const LoginResponse = z.object({
  user_id: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponse>;
