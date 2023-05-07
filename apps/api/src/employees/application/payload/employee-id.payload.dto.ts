import { IsString, IsUUID } from 'class-validator';

export class EmployeeIdPayloadDto {
  @IsString()
  @IsUUID()
  employeeId: string;
}
