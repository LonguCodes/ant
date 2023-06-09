import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IdPayload {
  @ApiProperty()
  @Expose()
  id: string;
}
