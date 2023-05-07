import { IEmployeeRepository } from '../repository/employee.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { EmployeeEntity } from '../entity/employee.entity';
import { makeBuilder } from '@ant-recruitment/test';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import {
  UpdateEmployeeCommand,
  UpdateEmployeeCommandHandler,
} from './update-employee.command';

describe('UpdateEmployeeCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let handler: UpdateEmployeeCommandHandler;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    handler = new UpdateEmployeeCommandHandler(employeeRepository);
  });

  it('Should update employee', async () => {
    // Arrange

    const payload = { firstName: faker.name.firstName() };
    const command = new UpdateEmployeeCommand(faker.datatype.uuid(), payload);

    employeeRepository.saveMany.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create({ firstName: faker.name.firstName() })
    );
    // Act

    await handler.execute(command);

    // Assert

    expect(employeeRepository.save).toHaveBeenCalled();
    expect(employeeRepository.save.mock.lastCall[0].firstName).toEqual(
      payload.firstName
    );
  });

  it('Should throw when employee does not exist', async () => {
    // Arrange

    const command = new UpdateEmployeeCommand(faker.datatype.uuid(), {});

    employeeRepository.findOneById.mockResolvedValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(
      EmployeeNotFoundError
    );
  });
});
