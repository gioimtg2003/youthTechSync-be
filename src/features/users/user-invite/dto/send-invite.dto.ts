import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class SendInviteDto {
  @IsNotEmpty({ message: 'Email is required' })
  @ValidateIf((_, value) => typeof value === 'string')
  @IsEmail({}, { message: 'Invalid email address' })
  @ValidateIf((_, value) => Array.isArray(value))
  @IsArray({ message: 'Email must be an array' })
  @ArrayNotEmpty({ message: 'Email array must not be empty' })
  @IsEmail({}, { each: true, message: 'Invalid email in array' })
  email: string | string[];
}
