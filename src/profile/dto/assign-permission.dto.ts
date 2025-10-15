import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';

// DTO para la asignación de permisos
export class AssignPermissionDto {
  @IsEnum(['add', 'remove'])
  action: 'add' | 'remove';

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  permissionGroups: string[];
}
