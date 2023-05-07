import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DOMAIN_EVENTS_DISPATCHER,
  IDomainEventDispatcher,
} from '@ant-recruitment/domain-events';
import { TeamEntity } from '../../domain/entity/team.entity';
import { ITeamRepository } from '../../domain/repository/team.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TeamPostgresRepository implements ITeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly repository: Repository<TeamEntity>,
    @Inject(DOMAIN_EVENTS_DISPATCHER)
    private readonly dispatcher: IDomainEventDispatcher
  ) {}

  async findOneById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  @Transactional()
  async save(team: TeamEntity): Promise<TeamEntity> {
    const result = await this.repository.save(team);
    await this.dispatcher.commit(team);
    return result;
  }

  async delete(team: TeamEntity): Promise<void> {
    await this.repository.delete(team.id);
  }

  async findAll(): Promise<TeamEntity[]> {
    return this.repository.find();
  }
}
