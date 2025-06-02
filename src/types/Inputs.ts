import { z } from "zod/v4";

export const LoginPasswordSchema = z.object({
  login: z.string(),
  password: z.string().min(4).max(30)
})

export const ChangePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(4).max(30)
})

export const UUIDSchema = z.uuidv4()