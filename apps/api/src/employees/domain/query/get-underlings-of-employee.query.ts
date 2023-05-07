import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDto } from '../dto/employee.dto';
import { Inject } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { plainToInstance } from 'class-transformer';

export class GetUnderlingsOfEmployeeQuery {
  constructor(public readonly employeeId: string) {}
}

@QueryHandler(GetUnderlingsOfEmployeeQuery)
export class GetUnderlingsOfEmployeeQueryHandler
  implements IQueryHandler<GetUnderlingsOfEmployeeQuery, EmployeeDto[]>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({
    employeeId,
  }: GetUnderlingsOfEmployeeQuery): Promise<EmployeeDto[]> {
    const employees = await this.employeeRepository.findDirectEmployeesOf(
      employeeId
    );
    return plainToInstance(EmployeeDto, employees, { exposeUnsetFields: true });
  }
}
