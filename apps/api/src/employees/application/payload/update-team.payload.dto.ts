import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamPayloadDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
