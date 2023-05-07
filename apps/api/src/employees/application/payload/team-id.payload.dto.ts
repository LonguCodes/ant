import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamIdPayloadDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  teamId: string;
}
