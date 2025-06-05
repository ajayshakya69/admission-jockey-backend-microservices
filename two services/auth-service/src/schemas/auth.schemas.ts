import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
})

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
})

export const VerifyEmailParamsSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export type RegisterRequest = z.infer<typeof RegisterSchema>
export type LoginRequest = z.infer<typeof LoginSchema>
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>
export type RefreshTokenRequest = z.infer<typeof RefreshTokenSchema>
export type VerifyEmailParams = z.infer<typeof VerifyEmailParamsSchema>
