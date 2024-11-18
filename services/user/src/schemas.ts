import { z } from "zod";

const UserSchema = z.object({
  authUserId: z.string().min(3).max(10),
  name: z.string(),
  email: z.string().email(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

const UserCreateSchema = z.object({ body: UserSchema });

const UserUpdateSchema = z.object({
  params: z.object({ authUserId: z.string() }),
  body: UserSchema.omit({ authUserId: true })
    .partial()
    .extend({ field: z.enum(["authUserId", "id"]).optional().default("authUserId") }),
});

const UserGetSchema = z.object({
  params: z.object({ id: z.string() }),
  query: z.object({
    field: z.enum(["authUserId", "id"]).optional().default("id"),
  }),
});

export { UserCreateSchema, UserGetSchema, UserUpdateSchema };
