import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
  IsIn,
} from 'class-validator';
import { IsUniqueValidator } from 'src/common/validators/unique.validator';
import { User } from 'src/modules/user/entities/user.entity';
import { Language, LanguagesList } from 'src/modules/user/types/language.type';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Validate(IsUniqueValidator, [User, 'email'], {
    message: 'Email $value already in use',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(LanguagesList)
  language: Language;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
