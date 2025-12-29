import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'root' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({
    example: 'jUQVlukrOXlKZg3C1m1uJ3HmYpD1ViVEzb7VwaTjuRypaCmeXl',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4OTAyODQwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  inviteToken?: string;
}
