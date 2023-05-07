import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import { EmployeeEntity } from '../entity/employee.entity';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import { TeamEntity } from '../entity/team.entity';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';
import { TeamNotFoundError } from '../error/team-not-found.error';

export class UpdateTeamCommand {
  constructor(
    public readonly teamId: string,
    public readonly payload: Partial<Pick<TeamEntity, 'name'>>
  ) {}
}

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamCommandHandler
  implements ICommandHandler<UpdateTeamCommand, void>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository
  ) {}

  async execute({ teamId, payload }: UpdateTeamCommand): Promise<void> {
    const team = await this.teamRepository.findOneById(teamId);
    if (!team) throw new TeamNotFoundError(teamId);
    const updated = Object.assign(team, payload);
    await this.teamRepository.save(updated);
  }
}
