import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common"
import type { Request } from "express"
import * as jwt from "jsonwebtoken"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    [key: string]: any
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  private readonly jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key-12345"

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      this.logger.warn("⚠️ Authorization header missing or malformed")
      throw new UnauthorizedException("Authorization header missing or malformed")
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any
      request.user = decoded
      return true
    } catch (error) {
      this.logger.warn("⚠️ Invalid or expired token")
      throw new UnauthorizedException("Invalid or expired token")
    }
  }
}
