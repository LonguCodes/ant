import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import { EmployeeEntity } from '../entity/employee.entity';

export class UpdateEmployeeCommand {
  constructor(
    public readonly employeeId: string,
    public readonly payload: Partial<
      Pick<EmployeeEntity, 'firstName' | 'lastName' | 'role'>
    >
  ) {}
}

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeCommandHandler
  implements ICommandHandler<UpdateEmployeeCommand, void>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async execute({ employeeId, payload }: UpdateEmployeeCommand): Promise<void> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) throw new Error('Oops | TODO');
    const updated = Object.assign(employee, payload);
    await this.employeeRepository.save(updated);
  }
}
