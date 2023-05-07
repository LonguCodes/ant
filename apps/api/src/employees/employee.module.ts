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
import { GetSubordinatesOfEmployeeQueryHandler } from './domain/query/get-subordinates-of-employee.query';
import { GetTeamByEmployeeQueryHandler } from './domain/query/get-team-by-employee.query';
import { GetTeamQueryHandler } from './domain/query/get-team.query';
import { GetTeamsQueryHandler } from './domain/query/get-teams.query';
import { CreateTeamCommandHandler } from './domain/command/create-team.command';
import { AssignToTeamCommandHandler } from './domain/command/assign-to-team.command';
import { DeleteTeamCommandHandler } from './domain/command/delete-team.command';
import { UpdateTeamCommandHandler } from './domain/command/update-team.command';
import { TEAM_REPOSITORY } from './domain/repository/team.repository';
import { TeamPostgresRepository } from './infrastructure/repository/team.postgres.repository';
import {TeamEntity} from "./domain/entity/team.entity";
import {TeamController} from "./application/controller/team.controller";
import {GetTeamMembersQueryHandler} from "./domain/query/get-team-members.query";

const queries = [
  GetEmployeeQueryHandler,
  GetEmployeesQueryHandler,
  GetSubordinatesOfEmployeeQueryHandler,
  GetTeamByEmployeeQueryHandler,
  GetTeamQueryHandler,
  GetTeamsQueryHandler,
  GetTeamMembersQueryHandler,
];
const commands = [
  AddEmployeeCommandHandler,
  AssignManagerCommandHandler,
  DeleteEmployeeCommandHandler,
  UpdateEmployeeCommandHandler,
  CreateTeamCommandHandler,
  AssignToTeamCommandHandler,
  DeleteTeamCommandHandler,
  UpdateTeamCommandHandler,
];
const events = [EmployeeManagerChangedEventHandler];
const repositories = [
  { provide: EMPLOYEE_REPOSITORY, useClass: EmployeePostgresRepository },
  { provide: TEAM_REPOSITORY, useClass: TeamPostgresRepository },
];

@Module({
  imports: [
    DomainModule,
    CqrsModule,
    TypeOrmModule.forFeature([EmployeeEntity, TeamEntity]),
  ],
  providers: [...queries, ...commands, ...events, ...repositories],
  controllers: [EmployeeController, TeamController],
})
export class EmployeeModule {}
