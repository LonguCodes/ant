import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamPayloadDto {
  @IsString()
  @ApiProperty()
  name: string;
}
