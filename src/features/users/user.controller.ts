import { SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { CurrentUser } from '@decorators';
import { UserAuthGuard } from '@features/user-auth/guards';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: SYSTEM_RESOURCE.user, version: VERSIONING_API.v1 })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() user) {
    return user;
  }
}
