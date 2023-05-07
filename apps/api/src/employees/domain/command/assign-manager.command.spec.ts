import { IEmployeeRepository } from '../repository/employee.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { EmployeeEntity } from '../entity/employee.entity';
import { makeBuilder } from '@ant-recruitment/test';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import {
  AssignManagerCommand,
  AssignManagerCommandHandler,
} from './assign-manager.command';

describe('AssignManagerCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let handler: AssignManagerCommandHandler;
  let assignManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    handler = new AssignManagerCommandHandler(employeeRepository);
    assignManagerSpy = jest.spyOn(EmployeeEntity.prototype, `assignManager`);
  });

  it('Should assign manager', async () => {
    // Arrange

    const command = new AssignManagerCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    );

    employeeRepository.save.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create()
    );
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).toHaveBeenCalled();
    expect(employeeRepository.findOneById).toHaveBeenCalledTimes(2);
    expect(employeeRepository.save).toHaveBeenCalled();
  });
  it('Should throw when employee does not exist', async () => {
    // Arrange

    const command = new AssignManagerCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    );

    employeeRepository.save.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(undefined);
    assignManagerSpy.mockReturnValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(
      EmployeeNotFoundError
    );
  });
  it('Should throw when employee does not exist', async () => {
    // Arrange

    const command = new AssignManagerCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    );

    employeeRepository.save.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValueOnce(
      makeBuilder(EmployeeEntity).create()
    );
    employeeRepository.findOneById.mockResolvedValue(undefined);
    assignManagerSpy.mockReturnValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(
      EmployeeNotFoundError
    );
  });
});
