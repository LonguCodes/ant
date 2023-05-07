import { ApiProperty } from '@nestjs/swagger';

export class IdPayload {
  @ApiProperty()
  id: string;
}
