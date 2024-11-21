import { z } from "zod";

const UserRegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2).max(255),
    password: z.string().min(6).max(255),
  }),
});

const UserLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const UserUpdateSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).max(255).optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"]).optional(),
    verified: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().cuid(),
  }),
});

const AccessTokensSchema = z.object({
  body: z.object({
    accessToken: z.string(),
  }),
});

export { AccessTokensSchema, UserLoginSchema, UserRegisterSchema, UserUpdateSchema };
