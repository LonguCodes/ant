import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TeamDto } from '../dto/team.dto';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';

export class GetTeamsQuery {}

@QueryHandler(GetTeamsQuery)
export class GetTeamsQueryHandler
  implements IQueryHandler<GetTeamsQuery, TeamDto[]>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository
  ) {}
  async execute(): Promise<TeamDto[]> {
    const teams = await this.teamRepository.findAll();
    return plainToInstance(TeamDto, teams, { exposeUnsetFields: true });
  }
}
