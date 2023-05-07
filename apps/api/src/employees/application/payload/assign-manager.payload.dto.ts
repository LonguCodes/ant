import { IsString, IsUUID } from 'class-validator';

export class AssignManagerPayloadDto {
  @IsString()
  @IsUUID()
  employeeId: string;

  @IsString()
  @IsUUID()
  managerId: string;
}
