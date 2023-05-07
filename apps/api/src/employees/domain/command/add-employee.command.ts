import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import { IdPayload } from '../../../common/interfaces/id.payload';
import { EmployeeEntity } from '../entity/employee.entity';
import { plainToInstance } from 'class-transformer';

export class AddEmployeeCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly managerId?: string
  ) {}
}

@CommandHandler(AddEmployeeCommand)
export class AddEmployeeCommandHandler
  implements ICommandHandler<AddEmployeeCommand, IdPayload>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async execute({
    firstName,
    lastName,
    role,
    managerId,
  }: AddEmployeeCommand): Promise<IdPayload> {
    const entityPayload: EmployeeEntity = plainToInstance(
      EmployeeEntity,
      {
        firstName,
        lastName,
        role,
      },
      { exposeDefaultValues: true }
    );
    if (managerId) {
      const manager = await this.employeeRepository.findOneById(managerId);
      if (!manager) throw new Error('Oops | TODO');
      entityPayload.assignManager(manager);
    }

    const entity = await this.employeeRepository.save(entityPayload);

    return {
      id: entity.id,
    };
  }
}
