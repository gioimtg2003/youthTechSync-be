import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ example: 'user1' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{4,20}$/)
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  @MaxLength(20, {
    message: 'Username must be at most 20 characters long',
  })
  username: string;

  @ApiProperty({ example: 'user1' })
  @IsString()
  @Matches(/^[\w-.]+@([\w-.]+(\.[\w-.]+)+)$/)
  @MinLength(4, {
    message: 'Email must be at least 4 characters long',
  })
  @MaxLength(100, {
    message: 'Email must be at most 100 characters long',
  })
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(100, {
    message: 'Password must be at most 100 characters long',
  })
  password: string;
}
