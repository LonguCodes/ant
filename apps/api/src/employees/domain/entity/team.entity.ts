import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEventRoot } from '@ant-recruitment/domain-events';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'teams' })
export class TeamEntity extends DomainEventRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => EmployeeEntity, (entity) => entity.team)
  members: EmployeeEntity[];
}
