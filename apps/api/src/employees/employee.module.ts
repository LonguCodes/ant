import { Module } from '@nestjs/common';
import { DomainModule } from '@ant-recruitment/domain-events';
import { AddEmployeeCommandHandler } from './domain/command/add-employee.command';
import { EmployeeManagerChangedEventHandler } from './domain/events/employee-manager-changed.event';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './domain/entity/employee.entity';
import { EMPLOYEE_REPOSITORY } from './domain/repository/employee.repository';
import { EmployeePostgresRepository } from './infrastructure/repository/employee.postgres.repository';
import { EmployeeController } from './application/controller/employee.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AssignManagerCommandHandler } from './domain/command/assign-manager.command';
import { DeleteEmployeeCommandHandler } from './domain/command/delete-employee.command';
import { UpdateEmployeeCommandHandler } from './domain/command/update-employee.command';
import { GetEmployeeQueryHandler } from './domain/query/get-employee.query';
import { GetEmployeesQueryHandler } from './domain/query/get-employees.query';
import { GetUnderlingsOfEmployeeQueryHandler } from './domain/query/get-underlings-of-employee.query';

const queries = [
  GetEmployeeQueryHandler,
  GetEmployeesQueryHandler,
  GetUnderlingsOfEmployeeQueryHandler,
];
const commands = [
  AddEmployeeCommandHandler,
  AssignManagerCommandHandler,
  DeleteEmployeeCommandHandler,
  UpdateEmployeeCommandHandler,
];
const events = [EmployeeManagerChangedEventHandler];
const repositories = [
  { provide: EMPLOYEE_REPOSITORY, useClass: EmployeePostgresRepository },
];

@Module({
  imports: [
    DomainModule,
    CqrsModule,
    TypeOrmModule.forFeature([EmployeeEntity]),
  ],
  providers: [...queries,...commands, ...events, ...repositories],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
