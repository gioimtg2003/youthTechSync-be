import { EmailRegex } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({
    example: 'user@example.com',
    required: false,
    description: 'Email address to send invite to (optional)',
  })
  @IsOptional()
  @IsString()
  @Matches(EmailRegex)
  @MaxLength(100)
  email?: string;
}
