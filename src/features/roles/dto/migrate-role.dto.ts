import { IsNotEmpty, IsNumber } from 'class-validator';

export class MigrateRoleDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Source team ID is required' })
  id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Target team ID is required' })
  toTeamId: number;
}
