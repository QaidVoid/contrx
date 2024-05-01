import { z } from "zod";

export const User = z.object({
  id: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  first_name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  last_name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  password: z.string().min(8, { message: "Must be 8 or more characters long" }),
});

export type User = z.infer<typeof User>;

export const SafeUser = User.omit({ password: true });

export type SafeUser = z.infer<typeof SafeUser>;

export const NewUserPayload = User.omit({ id: true }).extend({
  confirm_password: z.string().min(8, { message: "Must be 8 or more characters long" }),
});

export type NewUserPayload = z.infer<typeof NewUserPayload>;

export const NewUserResponse = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type NewUserResponse = z.infer<typeof NewUserResponse>;
