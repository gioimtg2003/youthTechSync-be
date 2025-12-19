import { UserRegisterDto } from '@features/user-auth/dto';
import { PickType } from '@nestjs/swagger';

export class CreateUserToTeamDto extends PickType(UserRegisterDto, ['email']) {}
