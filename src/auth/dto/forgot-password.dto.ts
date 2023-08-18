import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator'; // Importez IsEmail pour la validation

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email is not valid' }) // Utilisez @IsEmail pour la validation isEmail
  email: string;
}
