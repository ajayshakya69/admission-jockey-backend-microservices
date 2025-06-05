import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { TokenService } from "./token.service"
import { MailService } from "./mail.service"
import { User, UserSchema } from "./schemas/user.schema"
import { Token, TokenSchema } from "./schemas/token.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-12345",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, MailService],
})
export class AuthModule {}
