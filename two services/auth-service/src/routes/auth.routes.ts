import { Router } from "express"
import { authController } from "../controllers/auth.controller"
import { tokenController } from "../controllers/token.controller"
import { validateBody, validateParams } from "../middlewares/validation.middleware"
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RefreshTokenSchema,
  VerifyEmailParamsSchema,
} from "../schemas/auth.schemas"

const router = Router()

// User registration
router.post("/register", validateBody(RegisterSchema), authController.register.bind(authController))

// User login
// router.post("/login", validateBody(LoginSchema), authController.login.bind(authController))

// Refresh authentication token
router.post("/refresh-token", validateBody(RefreshTokenSchema), tokenController.refreshToken.bind(tokenController))

// Request password reset
router.post("/forgot-password", validateBody(ForgotPasswordSchema), authController.forgotPassword.bind(authController))

// Reset password
router.post("/reset-password", validateBody(ResetPasswordSchema), authController.resetPassword.bind(authController))

// Email verification
router.get(
  "/verify-email/:token",
  validateParams(VerifyEmailParamsSchema),
  authController.verifyEmail.bind(authController),
)

// Test endpoint
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Auth service is running!",
    timestamp: new Date().toISOString(),
  })
})

export default router
