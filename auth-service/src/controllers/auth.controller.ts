import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Token } from "../models/token.model";
import { mailService } from "../services/mail.service";
import { logger } from "../utils/logger";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailParams,
} from "../schemas/auth.schemas";
import type { AuthResponse, JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export class AuthController {
  async register(
    req: Request<{}, any, RegisterRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          message: "Email already registered",
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        name,
        verified: false,
      });

      await user.save();

      // Send verification email
      const verificationToken = jwt.sign(
        { userId: user._id } as JWTPayload,
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      await mailService.sendVerificationEmail(email, verificationToken);

      logger.info("User registered successfully", {
        userId: user._id,
        email: user.email,
      });

      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        statusCode: 201,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async login(
    req: Request<{}, any, LoginRequest>,
    res: Response<AuthResponse | any>
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(401).json({
          message: "Invalid credentials",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          message: "Invalid credentials",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!user.verified) {
        res.status(403).json({
          message:
            "Email not verified. Please check your email for verification link.",
          statusCode: 403,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const tokenPayload: JWTPayload = { userId: user._id };
      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });
      const refreshToken = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });

      // Save refresh token
      const tokenDoc = new Token({ userId: user._id, token: refreshToken });
      await tokenDoc.save();

      logger.info("User logged in successfully", {
        userId: user._id,
        email: user.email,
      });

      res.json({
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          verified: user.verified,
        },
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async forgotPassword(
    req: Request<{}, any, ForgotPasswordRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not for security
        res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const resetToken = jwt.sign(
        { userId: user._id } as JWTPayload,
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      await mailService.sendResetPasswordEmail(email, resetToken);

      logger.info("Password reset email sent", {
        userId: user._id,
        email: user.email,
      });

      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Forgot password error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async resetPassword(
    req: Request<{}, any, ResetPasswordRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      const user = await User.findById(payload.userId);

      if (!user) {
        res.status(404).json({
          message: "User not found",
          statusCode: 404,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      // Invalidate all existing refresh tokens for this user
      await Token.deleteMany({ userId: user._id });

      logger.info("Password reset successfully", {
        userId: user._id,
        email: user.email,
      });

      res.json({
        message: "Password reset successful",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({
          message: "Invalid or expired token",
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      logger.error("Reset password error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async verifyEmail(
    req: Request<VerifyEmailParams>,
    res: Response
  ): Promise<void> {
    try {
      const { token } = req.params;

      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      const user = await User.findById(payload.userId);

      if (!user) {
        res.status(404).json({
          message: "User not found",
          statusCode: 404,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (user.verified) {
        res.json({
          message: "Email already verified",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      user.verified = true;
      await user.save();

      logger.info("Email verified successfully", {
        userId: user._id,
        email: user.email,
      });

      res.json({
        message: "Email verified successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({
          message: "Invalid or expired verification token",
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      logger.error("Email verification error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const authController = new AuthController();
