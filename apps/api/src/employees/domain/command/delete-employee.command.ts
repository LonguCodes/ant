import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import {EmployeeNotFoundError} from "../error/employee-not-found.error";

export class DeleteEmployeeCommand {
  constructor(public readonly employeeId: string) {}
}

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeCommandHandler
  implements ICommandHandler<DeleteEmployeeCommand, void>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async execute({ employeeId }: DeleteEmployeeCommand): Promise<void> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) throw new EmployeeNotFoundError(employeeId);

    const subordinates = await this.employeeRepository.findDirectEmployeesOf(
      employeeId
    );

    subordinates.forEach((subordinate) =>
      subordinate.assignManager(employee.directManager)
    );
    await this.employeeRepository.saveMany(subordinates);
    await this.employeeRepository.delete(employee);
  }
}
