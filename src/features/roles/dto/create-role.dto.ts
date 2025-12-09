import { ActionPermission, SYSTEM_RESOURCE } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';

export class ActionDto {
  @ApiProperty({
    description: 'Action permission',
    enum: ActionPermission,
    example: 'create',
  })
  @IsString({ message: 'Action must be a string' })
  @IsNotEmpty({ message: 'Action is required' })
  action: ActionPermission;

  @ApiProperty({
    description: 'Scope of the action permission',
    example: [1, 2, 3],
    required: false,
  })
  @IsArray({ message: 'Scope must be an array of numbers' })
  @Validate((value) => value?.every((item) => typeof item === 'number'), {
    message: 'Scope must be an array of numbers',
  })
  scope?: number[];
}

export class PermissionDto {
  @ApiProperty({
    description: 'Resource name',
    example: 'project',
  })
  @IsString({ message: 'Resource must be a string' })
  @IsNotEmpty({ message: 'Resource is required' })
  resource: SYSTEM_RESOURCE;

  @ApiProperty({
    description: 'List of actions for the resource',
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  actions: ActionDto[];
}

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @IsString({ message: 'Role name must be a string' })
  @Length(4, 50, { message: 'Role name must be between 4 and 50 characters' })
  @IsNotEmpty({ message: 'Role name is required' })
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role with full permissions',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description?: string;

  @ApiProperty({
    description: 'List of permissions for the role',
    isArray: true,
  })
  @Type(() => PermissionDto)
  @ValidateNested({ each: true })
  permissions: PermissionDto[];
}
