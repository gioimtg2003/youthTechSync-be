import { ActionPermission, SYSTEM_RESOURCE } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
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
  @IsEnum(ActionPermission, {
    message: 'Action must be a valid ActionPermission',
  })
  @IsNotEmpty({ message: 'Action is required' })
  action: ActionPermission;

  @ApiProperty({
    description: 'Scope of the action permission',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
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
  @IsEnum(SYSTEM_RESOURCE, {
    message: 'Resource must be a valid SYSTEM_RESOURCE',
  })
  @IsNotEmpty({ message: 'Resource is required' })
  resource: SYSTEM_RESOURCE;

  @ApiProperty({
    description: 'List of actions for the resource',
    isArray: true,
  })
  @IsArray({ message: 'Actions must be an array' })
  @ArrayNotEmpty({ message: 'Actions should not be empty' })
  @ValidateNested({
    each: true,
    message: 'Actions must be an array of ActionDto',
  })
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
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of permissions for the role',
    isArray: true,
  })
  @Type(() => PermissionDto)
  @ValidateNested({
    each: true,
    message: 'Permissions must be an array of PermissionDto',
  })
  permissions: PermissionDto[];
}
