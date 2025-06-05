import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { TokenDocument, Token } from "./schemas/token.schema";
import { UserDocument, User } from "./schemas/user.schema";
import type { RefreshTokenDto } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const tokenDoc = await this.tokenModel.findOne({ token: refreshToken });
    if (!tokenDoc) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      // Verify user still exists and is verified
      const user = await this.userModel.findById(payload.userId);
      if (!user || !user.verified) {
        await this.tokenModel.deleteOne({ _id: tokenDoc._id });
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newTokenPayload = { userId: payload.userId };
      const newToken = this.jwtService.sign(newTokenPayload);

      this.logger.log(
        `✅ Token refreshed successfully for user: ${payload.userId}`
      );

      return {
        token: newToken,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
