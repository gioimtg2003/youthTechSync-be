import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @ApiProperty({ example: 'root' })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'jUQVlukrOXlKZg3C1m1uJ3HmYpD1ViVEzb7VwaTjuRypaCmeXl',
  })
  password: string;
}
