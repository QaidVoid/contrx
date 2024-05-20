import { z } from "zod";
import { createPaginationSchema } from "./pagination";

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
  email: z.string().email({ message: "Invalid email" }),
  first_name: z.string(),
  last_name: z.string(),
});

export type NewUserResponse = z.infer<typeof NewUserResponse>;

export const NewUserErrorResponse = z.object({
  errors: z.array(
    z.object({
      code: z.enum([
        "email_already_used",
        "empty_password",
        "empty_confirm_password",
        "confirm_password",
        "password_mismatch",
      ]),
      message: z.string(),
    }),
  ),
});

export type NewUserErrorResponse = z.infer<typeof NewUserErrorResponse>;

export const OrganizationUser = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.string(),
  role: z.string(),
});

export type OrganizationUser = z.infer<typeof OrganizationUser>;

export const PaginatedOrganizationUsers = createPaginationSchema(OrganizationUser);

export type PaginatedOrganizationUsers = z.infer<typeof PaginatedOrganizationUsers>;

export const InviteUser = z.object({
  role: z.string(),
  email: z.string().email(),
});

export type InviteUser = z.infer<typeof InviteUser>;

export const InviteUserError = z.object({
  errors: z.array(
    z.object({
      code: z.enum(["already_invited", "user_not_found"]),
      message: z.string(),
    }),
  ),
});

export type InviteUserError = z.infer<typeof InviteUserError>;
