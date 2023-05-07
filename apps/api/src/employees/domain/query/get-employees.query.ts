import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDto } from '../dto/employee.dto';
import { Inject } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { plainToInstance } from 'class-transformer';

export class GetEmployeesQuery {}

@QueryHandler(GetEmployeesQuery)
export class GetEmployeesQueryHandler
  implements IQueryHandler<GetEmployeesQuery, EmployeeDto[]>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute(): Promise<EmployeeDto[]> {
    const employees = await this.employeeRepository.findAll();
    return plainToInstance(EmployeeDto, employees, { exposeUnsetFields: true });
  }
}
