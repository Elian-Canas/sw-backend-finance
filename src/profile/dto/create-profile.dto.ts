import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(4)
  display_name?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(80)
  description?: string;

  @IsNumber()
  hierarchy_level?: number;
}
