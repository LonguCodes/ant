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
  AssignToTeamCommand,
  AssignToTeamCommandHandler,
} from './assign-to-team.command';
import { ITeamRepository } from '../repository/team.repository';
import { TeamEntity } from '../entity/team.entity';
import { TeamNotFoundError } from '../error/team-not-found.error';

describe('AssignTeamCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let teamRepository: DeepMocked<ITeamRepository>;
  let handler: AssignToTeamCommandHandler;
  let assignManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    teamRepository = createMock<ITeamRepository>();

    handler = new AssignToTeamCommandHandler(
      employeeRepository,
      teamRepository
    );
    assignManagerSpy = jest.spyOn(EmployeeEntity.prototype, `assignToTeam`);
  });

  it('Should assign team', async () => {
    // Arrange

    const command = new AssignToTeamCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    );

    employeeRepository.save.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create()
    );
    teamRepository.findOneById.mockResolvedValue(
      makeBuilder(TeamEntity).create()
    );
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).toHaveBeenCalled();
    expect(employeeRepository.findOneById).toHaveBeenCalled();
    expect(teamRepository.findOneById).toHaveBeenCalled();
    expect(employeeRepository.save).toHaveBeenCalled();
  });
  it('Should throw when employee does not exist', async () => {
    // Arrange

    const command = new AssignToTeamCommand(
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

    const command = new AssignToTeamCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    );

    employeeRepository.save.mockResolvedValue(undefined);
    employeeRepository.findOneById.mockResolvedValue(
      makeBuilder(EmployeeEntity).create()
    );
    teamRepository.findOneById.mockResolvedValue(undefined);
    assignManagerSpy.mockReturnValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(TeamNotFoundError);
  });
});
