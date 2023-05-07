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
import {
  DeleteTeamCommand,
  DeleteTeamCommandHandler,
} from './delete-team.command';
import { ITeamRepository } from '../repository/team.repository';
import { TeamNotFoundError } from '../error/team-not-found.error';
import { TeamEntity } from '../entity/team.entity';

describe('DeleteTeamCommandHandler', () => {
  let employeeRepository: DeepMocked<IEmployeeRepository>;
  let teamRepository: DeepMocked<ITeamRepository>;
  let handler: DeleteTeamCommandHandler;
  let assignManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    employeeRepository = createMock<IEmployeeRepository>();
    teamRepository = createMock<ITeamRepository>();

    handler = new DeleteTeamCommandHandler(teamRepository, employeeRepository);
    assignManagerSpy = jest.spyOn(EmployeeEntity.prototype, `assignToTeam`);
  });

  it('Should delete team', async () => {
    // Arrange

    const command = new DeleteTeamCommand(faker.datatype.uuid());

    employeeRepository.saveMany.mockResolvedValue(undefined);
    teamRepository.findOneById.mockResolvedValue(
      makeBuilder(TeamEntity).create()
    );
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).not.toHaveBeenCalled();
    expect(teamRepository.delete).toHaveBeenCalled();
    expect(employeeRepository.saveMany).toHaveBeenCalled();
  });
  it('Should reassign manager to subordinates of the deleted', async () => {
    // Arrange
    const command = new DeleteTeamCommand(faker.datatype.uuid());

    employeeRepository.saveMany.mockResolvedValue(undefined);
    teamRepository.findOneById.mockResolvedValue(
      makeBuilder(TeamEntity).create()
    );
    employeeRepository.findByTeamId.mockResolvedValue([
      makeBuilder(EmployeeEntity).create(),
      makeBuilder(EmployeeEntity).create(),
    ]);
    assignManagerSpy.mockReturnValue(undefined);

    // Act

    await handler.execute(command);

    // Assert

    expect(assignManagerSpy).toHaveBeenCalledTimes(2);
    expect(teamRepository.delete).toHaveBeenCalled();
    expect(employeeRepository.saveMany).toHaveBeenCalled();
  });
  it('Should throw when team does not exist', async () => {
    // Arrange

    const command = new DeleteTeamCommand(faker.datatype.uuid());

    teamRepository.findOneById.mockResolvedValue(undefined);

    // Act & Assert

    await expect(handler.execute(command)).rejects.toThrow(TeamNotFoundError);
  });
});
