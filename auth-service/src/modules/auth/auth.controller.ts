import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from "./dto/auth.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth module")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @ApiOperation({ summary: "Create Users" })
  @ApiBody({ type: RegisterDto })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    console.log("Registering user with data:", registerDto);
    if (!registerDto.email)
      return {
        message: "Email is required",
        statusCode: 400,
        timestamp: new Date().toISOString(),
      };
    return this.authService.register(registerDto);
  }
  @Get("test")
  async test() {
    return {
      message: "Auth service is working",
      timestamp: new Date().toISOString(),
    };
  }
  @Post("test")
  async posttest() {
    return {
      message: "Auth service is working",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
  
    return this.authService.login(loginDto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("verify-email/:token")
  async verifyEmail(@Param("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("refresh-token")
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.tokenService.refreshToken(refreshTokenDto);
  }
}
