import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password, minimum length 6 characters",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User's full name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class LoginDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
