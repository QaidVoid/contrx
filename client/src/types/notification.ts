import { z } from "zod";

export const Notification = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  message: z.string(),
  notification_type: z.string(),
  read: z.boolean(),
  created_at: z.array(z.number())
});

export type Notification = z.infer<typeof Notification>;

export const Notifications = z.array(Notification);

export type Notifications = z.infer<typeof Notifications>;
