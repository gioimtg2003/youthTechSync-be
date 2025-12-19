import { EmailRegex } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email for registration',
  })
  @IsString()
  @Matches(EmailRegex)
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'Password for registration',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
