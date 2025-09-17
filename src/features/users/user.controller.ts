import { VERSIONING_API } from '@constants';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: 'user', version: VERSIONING_API.v1 })
export class UserController {
  constructor(private readonly userService: UserService) {}
}
