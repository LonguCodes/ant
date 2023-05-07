import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateEmployeePayloadDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
