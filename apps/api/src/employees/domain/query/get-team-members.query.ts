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
import { EmployeeDto } from '../dto/employee.dto';

export class GetTeamMembersQuery {
  constructor(public readonly teamId: string) {}
}

@QueryHandler(GetTeamMembersQuery)
export class GetTeamMembersQueryHandler
  implements IQueryHandler<GetTeamMembersQuery, EmployeeDto[]>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}
  async execute({ teamId }: GetTeamMembersQuery): Promise<EmployeeDto[]> {
    const team = await this.teamRepository.findOneById(teamId);
    if (!team) throw new TeamNotFoundError(teamId);

    const members = await this.employeeRepository.findByTeamId(teamId);
    return plainToInstance(EmployeeDto, members, { exposeUnsetFields: true });
  }
}
