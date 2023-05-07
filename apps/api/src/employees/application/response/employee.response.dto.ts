
import { ApiProperty } from '@nestjs/swagger';


export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  managerId: string | undefined;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  firstDayAtWork: string;
}
