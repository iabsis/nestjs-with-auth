import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/modules/user/types/success-response.type';
import { ResetPasswordDto } from './dto/reset-password';
import { UserHeader } from 'src/common/types/user-header.type';
import { isAuthenticatedWithResetToken } from './decorators/is-authenticated-with-reset-token';
import { HasRole } from './decorators/has-role.decorator';
import MongooseClassSerializerInterceptor from 'src/common/interceptors/mongoose-class-serializer.interceptor';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return await this.authService.login(user);
  }

  @Post('register')
  register(@Body() createUserDto: RegisterUserDto): Promise<User> {
    return this.userService.register(createUserDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @isAuthenticatedWithResetToken()
  @ApiOkResponse({ status: HttpStatus.ACCEPTED, type: SuccessResponse })
  @ApiBearerAuth()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() request: Request & { user: UserHeader },
  ): Promise<{ success: boolean }> {
    const success = await this.userService.resetPassword(
      request.user,
      resetPasswordDto.password,
    );

    return { success };
  }

  @Get('me')
  @HasRole('ANY')
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  getMyself(@Req() req: Request & { user: UserHeader }): Promise<User> {
    return this.userService.findById(req.user._id);
  }
}
