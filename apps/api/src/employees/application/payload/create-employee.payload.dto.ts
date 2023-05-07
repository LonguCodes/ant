import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeePayloadDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  role: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({required: false})
  managerId: string;
}
