import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';

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
    if (!employee) throw new Error('Oops | TODO');

    const underlings = await this.employeeRepository.findDirectEmployeesOf(
      employeeId
    );

    underlings.forEach((underling) =>
      underling.assignManager(employee.directManager)
    );
    await this.employeeRepository.saveMany(underlings);
    await this.employeeRepository.delete(employee);
  }
}
