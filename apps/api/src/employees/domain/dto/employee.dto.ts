import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmployeeDto {
  @Expose()
  id: string;

  @Expose({ name: 'directManagerId' })
  managerId: string | undefined;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  firstDayAtWork: string;
}
