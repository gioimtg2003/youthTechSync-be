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
  name: string;

  @Matches(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, {
    message:
      'Alias must be 3-63 characters long, only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.',
  })
  @IsOptional()
  @Length(3, 63, { message: 'Alias must be between 3 and 63 characters long.' })
  alias?: string;
}
