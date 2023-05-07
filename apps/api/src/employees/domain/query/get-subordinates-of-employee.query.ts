import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDto } from '../dto/employee.dto';
import { Inject } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { plainToInstance } from 'class-transformer';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';

export class GetSubordinatesOfEmployeeQuery {
  constructor(public readonly employeeId: string) {}
}

@QueryHandler(GetSubordinatesOfEmployeeQuery)
export class GetSubordinatesOfEmployeeQueryHandler
  implements IQueryHandler<GetSubordinatesOfEmployeeQuery, EmployeeDto[]>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({
    employeeId,
  }: GetSubordinatesOfEmployeeQuery): Promise<EmployeeDto[]> {
    const manager = await this.employeeRepository.findOneById(employeeId);
    if (!manager) throw new EmployeeNotFoundError(employeeId);

    const employees = await this.employeeRepository.findDirectEmployeesOf(
      employeeId
    );
    return plainToInstance(EmployeeDto, employees, { exposeUnsetFields: true });
  }
}
