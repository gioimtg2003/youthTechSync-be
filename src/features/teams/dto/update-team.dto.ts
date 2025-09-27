import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PickType(CreateTeamDto, ['name', 'alias']) {
  @ApiProperty({
    example: 'This is my team description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({
    example: '{"key": "value"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
