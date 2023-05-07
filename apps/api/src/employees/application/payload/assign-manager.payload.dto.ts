import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignManagerPayloadDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  managerId: string;
}
