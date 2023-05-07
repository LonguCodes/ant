import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { DateTime } from 'luxon';
import { DomainEventRoot } from '@ant-recruitment/domain-events';
import { EmployeeManagerChangedEvent } from '../events/employee-manager-changed.event';

@Entity({ name: 'employees' })
export class EmployeeEntity extends DomainEventRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    name: 'first_day_at_work',
    type: 'date',
  })
  firstDayAtWork: string;

  @Column()
  role: string;

  @Column({ name: 'direct_manager_id', nullable: true })
  directManagerId?: string;

  @Column({ name: 'all_manager_ids', array: true, type: 'text', default: [] })
  allManagerIds: string[] = [];

  @ManyToOne(() => EmployeeEntity, (entity) => entity.directEmployees, {
    persistence: false,
    cascade: false,
  })
  @JoinColumn({ name: 'direct_manager_id', referencedColumnName: 'id' })
  directManager: EmployeeEntity;

  @OneToMany(() => EmployeeEntity, (entity) => entity.directManager)
  directEmployees: EmployeeEntity[];

  public assignManager(manager: EmployeeEntity) {
    if (manager && manager.allManagerIds.includes(this.id))
      throw new Error('Oops | TODO');
    if (this.directManagerId === manager.id) return;
    this.directManagerId = manager.id;
    this.directManager = manager;
    this.addDomainEvent(new EmployeeManagerChangedEvent(this));
  }
}
