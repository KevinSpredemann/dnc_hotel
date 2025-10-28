import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
