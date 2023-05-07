import { ApiProperty } from '@nestjs/swagger';

export class TeamResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
