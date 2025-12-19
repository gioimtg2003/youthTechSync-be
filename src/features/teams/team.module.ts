import { MailModule } from '@common/services/mail';
import { CryptoModule } from '@features/crypto';
import { LocatorResourceModule } from '@features/locator-resource';
import { UserAuthModule } from '@features/user-auth';
import { UserTeamModule } from '@features/users/user-team';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability';
import { TeamInvite } from './entities/team-invite.entity';
import { Team } from './entities/team.entity';
import { TeamInviteController } from './team-invite.controller';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamInvite]),
    AbilityModule,
    CryptoModule,
    MailModule,
    forwardRef(() => LocatorResourceModule),
    forwardRef(() => UserAuthModule),
    forwardRef(() => UserTeamModule),
  ],
  controllers: [TeamController, TeamInviteController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
