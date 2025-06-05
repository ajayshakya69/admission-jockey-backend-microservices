import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "@/models/user.model"
import { Token } from "@/models/token.model"
import { UnauthorizedError, ConflictError, ValidationError } from "@/utils/errors"
import { logger } from "@/utils/logger"
import type { IUser } from "@/types/auth.types"
import type { RegisterInput } from "@/schemas/auth.schemas"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"

export class AuthService {
  static async registerUser(userData: RegisterInput): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new ConflictError("Email already registered")
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
        verified: false,
      })

      await user.save()
      logger.info("User registered successfully", { userId: user._id, email: user.email })

      return user.toObject()
    } catch (error) {
      if (error instanceof ConflictError) throw error
      logger.error("Error registering user:", error)
      throw new ValidationError("Failed to register user")
    }
  }

  static generateAccessToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )
  }

  static generateRefreshToken(user: IUser): string {
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
  }

  static async saveRefreshToken(userId: string, token: string): Promise<void> {
    try {
      // Remove existing refresh tokens for this user
      await Token.deleteMany({ userId })

      // Save new refresh token
      const tokenDoc = new Token({ userId, token })
      await tokenDoc.save()

      logger.info("Refresh token saved", { userId })
    } catch (error) {
      logger.error("Error saving refresh token:", error)
      throw new ValidationError("Failed to save refresh token")
    }
  }

  static async validateUserCredentials(email: string, password: string): Promise<IUser> {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        throw new UnauthorizedError("Invalid credentials")
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new UnauthorizedError("Invalid credentials")
      }

      // Check if email is verified
      if (!user.verified) {
        throw new UnauthorizedError("Email not verified")
      }

      logger.info("User credentials validated", { userId: user._id, email: user.email })

      // Remove password from returned object
      const userObject = user.toObject()
      delete userObject.password

      return userObject
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error
      logger.error("Error validating credentials:", error)
      throw new UnauthorizedError("Authentication failed")
    }
  }

  static async validateRefreshToken(token: string): Promise<IUser> {
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Check if token exists in database
      const tokenDoc = await Token.findOne({ token, userId: decoded.userId })
      if (!tokenDoc) {
        throw new UnauthorizedError("Invalid refresh token")
      }

      // Get user
      const user = await User.findById(decoded.userId)
      if (!user) {
        throw new UnauthorizedError("User not found")
      }

      return user.toObject()
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error
      logger.error("Error validating refresh token:", error)
      throw new UnauthorizedError("Invalid refresh token")
    }
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    try {
      await Token.deleteOne({ token })
      logger.info("Refresh token revoked")
    } catch (error) {
      logger.error("Error revoking refresh token:", error)
      throw new ValidationError("Failed to revoke token")
    }
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    try {
      await Token.deleteMany({ userId })
      logger.info("All user tokens revoked", { userId })
    } catch (error) {
      logger.error("Error revoking user tokens:", error)
      throw new ValidationError("Failed to revoke tokens")
    }
  }
}
