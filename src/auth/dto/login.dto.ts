import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator'; // Importez IsEmail pour la validation

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;
}
