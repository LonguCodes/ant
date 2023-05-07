import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignToTeamPayloadDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  teamId: string;
}
