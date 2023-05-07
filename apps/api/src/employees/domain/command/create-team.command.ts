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

export class CreateTeamCommand {
  constructor(public readonly name: string) {}
}

@CommandHandler(CreateTeamCommand)
export class CreateTeamCommandHandler
  implements ICommandHandler<CreateTeamCommand, IdPayload>
{
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: ITeamRepository
  ) {}

  async execute({ name }: CreateTeamCommand): Promise<IdPayload> {
    const entityPayload: TeamEntity = plainToInstance(
      TeamEntity,
      {
        name,
      },
      { exposeDefaultValues: true }
    );

    const entity = await this.teamRepository.save(entityPayload);

    return {
      id: entity.id,
    };
  }
}
