import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator"

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  name: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @MinLength(6)
  newPassword: string
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
