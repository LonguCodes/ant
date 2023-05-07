import {
  DomainEventHandler,
  IDomainEvent,
  IDomainEventHandler,
} from '@ant-recruitment/domain-events';
import { EmployeeEntity } from '../entity/employee.entity';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';

export class EmployeeManagerChangedEvent implements IDomainEvent {
  constructor(public readonly employee: EmployeeEntity) {}
}

@DomainEventHandler(EmployeeManagerChangedEvent)
export class EmployeeManagerChangedEventHandler
  implements IDomainEventHandler<EmployeeManagerChangedEvent>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async handle({ employee }: EmployeeManagerChangedEvent): Promise<void> {
    const manager = await this.employeeRepository.findOneById(
      employee.directManagerId
    );

    employee.allManagerIds = [...manager.allManagerIds, manager.id];
    await this.employeeRepository.save(employee);

    const underlings = await this.employeeRepository.findEmployeesOf(
      employee.id
    );

    underlings.forEach((underling) => {
      const employeeManagerIndex = underling.allManagerIds.findIndex(
        (managerId) => managerId === employee.id
      );
      underling.allManagerIds = [
        ...employee.allManagerIds,
        ...underling.allManagerIds.slice(employeeManagerIndex),
      ];
    });
    await this.employeeRepository.saveMany(underlings);
  }
}
