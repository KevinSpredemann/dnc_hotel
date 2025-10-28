import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface JwTPayload {
  name: string;
  iat?: number;
  expiresIn?: number;
  issuer?: string;
  audience?: string;
  sub: string;
}
export class ValidateTokenDTO {
  @IsBoolean()
  @IsNotEmpty()
  valid: boolean;

  decoded?: JwTPayload;

  @IsString()
  @IsOptional()
  message?: string;
}
