import { Inject, Injectable } from '@nestjs/common';
import { IEmployeeRepository } from '../../domain/repository/employee.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../domain/entity/employee.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  DOMAIN_EVENTS_DISPATCHER,
  IDomainEventDispatcher,
} from '@ant-recruitment/domain-events';

@Injectable()
export class EmployeePostgresRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly repository: Repository<EmployeeEntity>,
    @Inject(DOMAIN_EVENTS_DISPATCHER)
    private readonly dispatcher: IDomainEventDispatcher
  ) {}

  async findByTeamId(teamId: string): Promise<EmployeeEntity[]> {
    return this.repository.findBy({ teamId });
  }

  @Transactional()
  async saveMany(
    employees: Partial<EmployeeEntity>[]
  ): Promise<EmployeeEntity[]> {
    const results = await this.repository.save(employees);
    await this.dispatcher.commitMany(results);
    return results;
  }

  async findOneById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ['directManager'],
    });
  }
  @Transactional()
  async save(entity: Partial<EmployeeEntity>): Promise<EmployeeEntity> {
    const result = await this.repository.save(entity);
    await this.dispatcher.commit(result);
    return result;
  }

  async findDirectEmployeesOf(managerId: string): Promise<EmployeeEntity[]> {
    return this.repository.findBy({ directManagerId: managerId });
  }

  async findEmployeesOf(managerId: string): Promise<EmployeeEntity[]> {
    return this.repository
      .createQueryBuilder('employee')
      .where(`employee.all_manager_ids @> array[:managerId]`, {
        managerId,
      })
      .getMany();
  }

  async delete(employee: EmployeeEntity): Promise<void> {
    await this.repository.delete({ id: employee.id });
  }

  async findAll(): Promise<EmployeeEntity[]> {
    return this.repository.find();
  }
}
