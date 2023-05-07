import {
  AddEmployeeCommand,
  AddEmployeeCommandHandler,
} from './add-employee.command';
import { IEmployeeRepository } from '../repository/employee.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { EmployeeEntity } from '../entity/employee.entity';
import { makeBuilder } from '@ant-recruitment/test';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';

describe('AddEmployeeCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let handler: AddEmployeeCommandHandler;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    handler = new AddEmployeeCommandHandler(employeeRepository);
  });

  it('Should create employee', async () => {
    // Arrange

    const command = new AddEmployeeCommand(
      faker.name.firstName(),
      faker.name.lastName(),
      faker.name.jobTitle()
    );

    employeeRepository.save.mockResolvedValue({
      id: faker.datatype.uuid(),
    } as EmployeeEntity);

    // Act

    const result = await handler.execute(command);

    // Assert

    expect(result).toEqual({ id: expect.any(String) });
    expect(employeeRepository.findOneById).not.toHaveBeenCalled();
    expect(employeeRepository.save).toHaveBeenCalled();
  });
  it('Should create employee and assign manager', async () => {
    // Arrange

    const manager = makeBuilder(EmployeeEntity).create({
      id: faker.datatype.uuid(),
    });

    const command = new AddEmployeeCommand(
      faker.name.firstName(),
      faker.name.lastName(),
      faker.name.jobTitle(),
      manager.id
    );

    employeeRepository.findOneById.mockImplementation(async (id) =>
      id === manager.id ? manager : undefined
    );
    employeeRepository.save.mockImplementation(async (entity) => {
      entity.id = faker.datatype.uuid();
      return entity;
    });

    // Act

    const result = await handler.execute(command);

    // Assert

    expect(result).toEqual({ id: expect.any(String) });
    expect(employeeRepository.findOneById).toHaveBeenCalled();
    expect(employeeRepository.save).toHaveBeenCalled();
    expect(employeeRepository.save.mock.lastCall[0].events.length === 1);
    expect(
      employeeRepository.save.mock.lastCall[0].directManagerId === manager.id
    );
  });
  it('Should throw when manager does not exist', async () => {
    // Arrange

    const manager = makeBuilder(EmployeeEntity).create({
      id: faker.datatype.uuid(),
    });

    const command = new AddEmployeeCommand(
      faker.name.firstName(),
      faker.name.lastName(),
      faker.name.jobTitle(),
      manager.id
    );

    employeeRepository.findOneById.mockResolvedValue(undefined);

    // Act

    const resultPromise = handler.execute(command);

    // Assert

    await expect(resultPromise).rejects.toThrow(EmployeeNotFoundError);
  });
});
