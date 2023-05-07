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
import {
  DeleteEmployeeCommand,
  DeleteEmployeeCommandHandler,
} from './delete-employee.command';

describe('DeleteEmployeeCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let handler: DeleteEmployeeCommandHandler;
  let assignManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    handler = new DeleteEmployeeCommandHandler(employeeRepository);
    assignManagerSpy = jest.spyOn(EmployeeEntity.prototype, `assignManager`);
  });

  it('Should delete employee', async () => {
    // Arrange

    const command = new DeleteEmployeeCommand(faker.datatype.uuid());

    employeeRepository.saveMany.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create()
    );
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).not.toHaveBeenCalled();
    expect(employeeRepository.delete).toHaveBeenCalled();
    expect(employeeRepository.saveMany).toHaveBeenCalled();
  });
  it('Should reassign manager to subordinates of the deleted', async () => {
    // Arrange
    const builder = makeBuilder(EmployeeEntity);

    const manager = builder.create().withId(faker.datatype.uuid());
    const employee = builder
      .create()
      .withDirectManager(manager)
      .withDirectManagerId(manager.id);

    const command = new DeleteEmployeeCommand(faker.datatype.uuid());

    employeeRepository.saveMany.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(employee);
    employeeRepository.findDirectEmployeesOf.mockResolvedValue([
      builder.create(),
      builder.create(),
      builder.create(),
    ]);
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).toHaveBeenCalledTimes(3);
    expect(employeeRepository.delete).toHaveBeenCalled();
    expect(employeeRepository.saveMany).toHaveBeenCalled();
  });
  it('Should throw when employee does not exist', async () => {
    // Arrange

    const command = new DeleteEmployeeCommand(faker.datatype.uuid());

    employeeRepository.findOneById.mockResolvedValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(
      EmployeeNotFoundError
    );
  });
});
