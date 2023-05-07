import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDto } from '../dto/employee.dto';
import { Inject } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { plainToInstance } from 'class-transformer';

export class GetEmployeeQuery {
  constructor(public readonly employeeId: string) {}
}

@QueryHandler(GetEmployeeQuery)
export class GetEmployeeQueryHandler
  implements IQueryHandler<GetEmployeeQuery, EmployeeDto>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({ employeeId }: GetEmployeeQuery): Promise<EmployeeDto> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    return plainToInstance(EmployeeDto, employee, { exposeUnsetFields: true });
  }
}
