import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TeamDto } from '../dto/team.dto';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';
import { TeamNotFoundError } from '../error/team-not-found.error';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import { EmployeeWithoutTeamError } from '../error/employee-without-team.error';

export class GetTeamByEmployeeQuery {
  constructor(public readonly employeeId: string) {}
}

@QueryHandler(GetTeamByEmployeeQuery)
export class GetTeamByEmployeeQueryHandler
  implements IQueryHandler<GetTeamByEmployeeQuery, TeamDto>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({ employeeId }: GetTeamByEmployeeQuery): Promise<TeamDto> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) throw new EmployeeNotFoundError(employeeId);
    if (!employee.teamId) throw new EmployeeWithoutTeamError(employeeId);

    const team = await this.teamRepository.findOneById(employee.teamId);
    if (!team) throw new TeamNotFoundError(employee.teamId);
    return plainToInstance(TeamDto, team, { exposeUnsetFields: true });
  }
}
