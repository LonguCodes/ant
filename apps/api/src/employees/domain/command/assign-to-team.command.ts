import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import { EmployeeEntity } from '../entity/employee.entity';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';
import { TeamNotFoundError } from '../error/team-not-found.error';

export class AssignToTeamCommand {
  constructor(
    public readonly employeeId: string,
    public readonly teamId: string
  ) {}
}

@CommandHandler(AssignToTeamCommand)
export class AssignToTeamCommandHandler
  implements ICommandHandler<AssignToTeamCommand, void>
{
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository
  ) {}

  async execute({ employeeId, teamId }: AssignToTeamCommand): Promise<void> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) throw new EmployeeNotFoundError(employeeId);

    const team = await this.teamRepository.findOneById(teamId);
    if (!team) throw new TeamNotFoundError(teamId);

    employee.assignToTeam(team);
    await this.employeeRepository.save(employee);
  }
}
