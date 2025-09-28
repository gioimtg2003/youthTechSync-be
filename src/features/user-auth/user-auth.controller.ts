import { VERSIONING_API } from '@constants';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto, UserRegisterDto } from './dto';
import { UserAuthGuard } from './guards';
import { UserAuthService } from './user-auth.service';

@Controller({
  path: 'user-auth',
  version: VERSIONING_API.v1,
})
@ApiTags('User Auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User registered successfully', type: Boolean })
  async register(@Body() userData: UserRegisterDto) {
    return this.userAuthService.register(userData);
  }

  @UseGuards(AuthGuard('user-local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged in successfully', type: Boolean })
  login(@Body() _: UserLoginDto, @Req() req: any) {
    req.session.user = req?.user;
    if (!req.session.user) {
      throw new UnauthorizedException('Login failed');
    }

    return true;
  }

  @UseGuards(UserAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out successfully', type: Boolean })
  logout(@Req() req: any, @Response() res: any) {
    req.session?.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });

    res?.clearCookie('connect.sid');

    return res?.status(HttpStatus.OK).send(true);
  }
}
