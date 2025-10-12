import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddUserToTeamDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user to be added to the team',
  })
  @IsNumber()
  userId: number;
}

export class RemoveUserFromTeamDto extends AddUserToTeamDto {}
