import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendInviteDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;
}
