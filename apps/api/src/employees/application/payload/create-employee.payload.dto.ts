import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEmployeePayloadDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  managerId: string;
}
