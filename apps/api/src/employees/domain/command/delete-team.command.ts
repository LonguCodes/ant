import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../repository/employee.repository';
import { Inject } from '@nestjs/common';
import { IdPayload } from '../../../common/interfaces/id.payload';
import { EmployeeEntity } from '../entity/employee.entity';
import { plainToInstance } from 'class-transformer';
import { EmployeeNotFoundError } from '../error/employee-not-found.error';
import {
  ITeamRepository,
  TEAM_REPOSITORY,
} from '../repository/team.repository';
import { TeamEntity } from '../entity/team.entity';
import { TeamNotFoundError } from '../error/team-not-found.error';

export class DeleteTeamCommand {
  constructor(public readonly teamId: string) {}
}

@CommandHandler(DeleteTeamCommand)
export class DeleteTeamCommandHandler
  implements ICommandHandler<DeleteTeamCommand, void>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async execute({ teamId }: DeleteTeamCommand): Promise<void> {
    const team = await this.teamRepository.findOneById(teamId);
    if (!team) throw new TeamNotFoundError(teamId);

    const members = await this.employeeRepository.findByTeamId(teamId);
    members.forEach((member) => member.assignToTeam(null));

    await this.employeeRepository.saveMany(members);
    await this.teamRepository.delete(team)
  }
}
