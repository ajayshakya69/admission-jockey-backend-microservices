import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import  { JwtService } from "@nestjs/jwt"
import type { Model } from "mongoose"
import * as bcrypt from "bcrypt"
import { User, type UserDocument } from "./schemas/user.schema"
import { Token, type TokenDocument } from "./schemas/token.schema"
import  { MailService } from "./mail.service"
import type { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "./dto/auth.dto"

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto

    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      throw new BadRequestException("Email already registered")
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      verified: false,
    })

    await user.save()

    // Send verification email
    const verificationToken = this.jwtService.sign({ userId: user._id }, { expiresIn: "1d" })
    await this.mailService.sendVerificationEmail(email, verificationToken)

    this.logger.log(`✅ User registered successfully: ${email}`)

    return {
      message: "User registered successfully. Please verify your email.",
      statusCode: 201,
      timestamp: new Date().toISOString(),
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userModel.findOne({ email }).select("+password")
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (!user.verified) {
      throw new UnauthorizedException("Email not verified. Please check your email for verification link.")
    }

    const tokenPayload = { userId: user._id }
    const token = this.jwtService.sign(tokenPayload)
    const refreshToken = this.jwtService.sign(tokenPayload, { expiresIn: "7d" })

    // Save refresh token
    const tokenDoc = new this.tokenModel({ userId: user._id, token: refreshToken })
    await tokenDoc.save()

    this.logger.log(`✅ User logged in successfully: ${email}`)

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        verified: user.verified,
      },
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message: "If an account with that email exists, a password reset link has been sent.",
        timestamp: new Date().toISOString(),
      }
    }

    const resetToken = this.jwtService.sign({ userId: user._id }, { expiresIn: "1h" })
    await this.mailService.sendResetPasswordEmail(email, resetToken)

    this.logger.log(`✅ Password reset email sent: ${email}`)

    return {
      message: "If an account with that email exists, a password reset link has been sent.",
      timestamp: new Date().toISOString(),
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto

    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userModel.findById(payload.userId)

      if (!user) {
        throw new NotFoundException("User not found")
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword
      await user.save()

      // Invalidate all existing refresh tokens for this user
      await this.tokenModel.deleteMany({ userId: user._id })

      this.logger.log(`✅ Password reset successfully: ${user.email}`)

      return {
        message: "Password reset successful",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      throw new BadRequestException("Invalid or expired token")
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userModel.findById(payload.userId)

      if (!user) {
        throw new NotFoundException("User not found")
      }

      if (user.verified) {
        return {
          message: "Email already verified",
          timestamp: new Date().toISOString(),
        }
      }

      user.verified = true
      await user.save()

      this.logger.log(`✅ Email verified successfully: ${user.email}`)

      return {
        message: "Email verified successfully",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      throw new BadRequestException("Invalid or expired verification token")
    }
  }
}
