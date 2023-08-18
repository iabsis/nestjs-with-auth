import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { HasRole } from 'src/auth/decorators/has-role.decorator';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HasRole(['admin'])
  findAll() {
    return this.userService.findAll();
  }
}
