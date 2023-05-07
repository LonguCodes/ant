import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';

export class AssignManagerCommand {
  constructor(
    public readonly employeeId: string,
    public readonly managerId: string
  ) {}
}

@CommandHandler(AssignManagerCommand)
export class AssignManagerCommandHandler
  implements ICommandHandler<AssignManagerCommand, void>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({
    employeeId,
    managerId,
  }: AssignManagerCommand): Promise<void> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) throw new Error('Oops | TODO');
    const manager = await this.employeeRepository.findOneById(managerId);
    if (!manager) throw new Error('Oops | TODO');
    employee.assignManager(manager);
    await this.employeeRepository.save(employee);
  }
}
