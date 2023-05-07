import { IEmployeeRepository } from '../repository/employee.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { EmployeeEntity } from '../entity/employee.entity';
import { makeBuilder } from '@ant-recruitment/test';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';

import { EmployeeDto } from '../dto/employee.dto';
import {
  GetEmployeeQuery,
  GetEmployeeQueryHandler,
} from './get-employee.query';

describe('GetEmployeeQueryHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let handler: GetEmployeeQueryHandler;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    handler = new GetEmployeeQueryHandler(employeeRepository);
  });

  it('Should find subordinates', async () => {
    // Arrange
    const command = new GetEmployeeQuery(faker.datatype.uuid());

    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create()
    );

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result).toBeInstanceOf(EmployeeDto);
  });
  it('Should throw when employee does not exist', async () => {
    // Arrange
    const command = new GetEmployeeQuery(faker.datatype.uuid());

    employeeRepository.findOneById.mockResolvedValue(undefined);

    // Act

    const resultPromise = handler.execute(command);

    // Assert

    await expect(resultPromise).rejects.toThrow(EmployeeNotFoundError);
  });
});
