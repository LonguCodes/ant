import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeIdPayloadDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  employeeId: string;
}
