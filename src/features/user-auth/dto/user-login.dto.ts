import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
