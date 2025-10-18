import { TeamAliasRegex } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Team' })
  name: string;

  @Matches(TeamAliasRegex, {
    message:
      'Alias must be 3-63 characters long, only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.',
  })
  @IsOptional()
  @Length(3, 63, { message: 'Alias must be between 3 and 63 characters long.' })
  @ApiProperty({ example: 'my_team', required: false })
  alias?: string;
}
