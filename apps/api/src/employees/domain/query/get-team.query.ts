import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TeamDto } from '../dto/team.dto';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';
import { TeamNotFoundError } from '../error/team-not-found.error';

export class GetTeamQuery {
  constructor(public readonly teamId: string) {}
}

@QueryHandler(GetTeamQuery)
export class GetTeamQueryHandler
  implements IQueryHandler<GetTeamQuery, TeamDto>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository
  ) {}
  async execute({ teamId }: GetTeamQuery): Promise<TeamDto> {
    const team = await this.teamRepository.findOneById(teamId);
    if (!team) throw new TeamNotFoundError(teamId);
    return plainToInstance(TeamDto, team, { exposeUnsetFields: true });
  }
}
