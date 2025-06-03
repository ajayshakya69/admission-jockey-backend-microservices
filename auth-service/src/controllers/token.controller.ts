import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";
import { logger } from "../utils/logger";
import type { RefreshTokenRequest } from "../schemas/auth.schemas";
import type { JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class TokenController {
  async refreshToken(
    req: Request<{}, any, RefreshTokenRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const tokenDoc = await Token.findOne({ token: refreshToken });
      if (!tokenDoc) {
        res.status(401).json({
          message: "Invalid refresh token",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const payload = jwt.verify(refreshToken, JWT_SECRET) as JWTPayload;

      // Verify user still exists and is verified
      const user = await User.findById(payload.userId);
      if (!user || !user.verified) {
        await Token.deleteOne({ _id: tokenDoc._id });
        res.status(401).json({
          message: "Invalid refresh token",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const newTokenPayload: JWTPayload = { userId: payload.userId };
      const newToken = jwt.sign(newTokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });

      logger.info("Token refreshed successfully", { userId: payload.userId });

      res.json({
        token: newToken,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          message: "Invalid or expired refresh token",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      logger.error("Token refresh error:", error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const tokenController = new TokenController();
