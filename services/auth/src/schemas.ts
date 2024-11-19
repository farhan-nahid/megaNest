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

export { UserLoginSchema, UserRegisterSchema };
