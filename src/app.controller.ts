import { VERSIONING_API } from '@constants';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AppService } from './app.service';

@ApiTags('App')
@Controller({
  version: VERSIONING_API.v1,
  path: 'app',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }

  @ApiHeader({
    name: 'x-api-key',
    description: 'API key to authorize adding root account',
    required: true,
  })
  @Post('/add-account/:username/:email/:password')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Add root account' })
  addRootAccount(
    @Req() request: Request,
    @Param('username') username: string,
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    if (!username || !email || !password) {
      return {
        message: 'Missing parameters',
      };
    }
    if (request.headers['x-api-key'] !== process.env.ROOT_USER_PASSWORD) {
      return {
        message: 'Unauthorized',
      };
    }
    return this.appService.addRootAccount(username, email, password);
  }
}
