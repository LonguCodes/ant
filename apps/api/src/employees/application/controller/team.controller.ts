import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddEmployeeCommand } from '../../domain/command/add-employee.command';
import { AssignManagerCommand } from '../../domain/command/assign-manager.command';
import { AssignManagerPayloadDto } from '../payload/assign-manager.payload.dto';
import { CreateEmployeePayloadDto } from '../payload/create-employee.payload.dto';
import { EmployeeIdPayloadDto } from '../payload/employee-id.payload.dto';
import { DeleteEmployeeCommand } from '../../domain/command/delete-employee.command';
import { GetSubordinatesOfEmployeeQuery } from '../../domain/query/get-subordinates-of-employee.query';
import { GetEmployeeQuery } from '../../domain/query/get-employee.query';
import { GetEmployeesQuery } from '../../domain/query/get-employees.query';
import { UpdateEmployeePayloadDto } from '../payload/update-employee.payload.dto';
import { UpdateEmployeeCommand } from '../../domain/command/update-employee.command';
import { EmployeeNotFoundError } from '../../domain/error/employee-not-found.error';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdPayload } from '../../../common/interfaces/id.payload';
import { EmployeeResponseDto } from '../response/employee.response.dto';
import { CreateTeamPayloadDto } from '../payload/create-team.payload.dto';
import { CreateTeamCommand } from '../../domain/command/create-team.command';
import { TeamIdPayloadDto } from '../payload/team-id.payload.dto';
import { UpdateTeamPayloadDto } from '../payload/update-team.payload.dto';
import { UpdateTeamCommand } from '../../domain/command/update-team.command';
import { TeamNotFoundError } from '../../domain/error/team-not-found.error';
import { DeleteTeamCommand } from '../../domain/command/delete-team.command';
import { TeamResponseDto } from '../response/team.response.dto';
import { GetTeamMembersQuery } from '../../domain/query/get-team-members.query';
import { GetTeamQuery } from '../../domain/query/get-team.query';
import { GetTeamsQuery } from '../../domain/query/get-teams.query';

@Controller('teams')
@ApiTags('employees')
export class TeamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdPayload,
    description: 'Team created',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() { name }: CreateTeamPayloadDto) {
    return this.commandBus
      .execute(new CreateTeamCommand(name))
      .transform(IdPayload);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team does not exist',
  })
  @Patch(':teamId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() { teamId }: TeamIdPayloadDto,
    @Body() payload: UpdateTeamPayloadDto
  ) {
    return this.commandBus
      .execute(new UpdateTeamCommand(teamId, payload))
      .rethrowAs(TeamNotFoundError, NotFoundException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team does not exist',
  })
  @Delete(':teamId')
  async deleteEmployee(@Param() { teamId }: TeamIdPayloadDto) {
    return this.commandBus
      .execute(new DeleteTeamCommand(teamId))
      .rethrowAs(TeamNotFoundError, NotFoundException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team does not exist',
  })
  @Get(':teamId/members')
  async getMembers(@Param() { teamId }: TeamIdPayloadDto) {
    return this.queryBus
      .execute(new GetTeamMembersQuery(teamId))
      .rethrowAs(TeamNotFoundError, NotFoundException);
  }
  @ApiResponse({
    status: HttpStatus.OK,
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team does not exist',
  })
  @Get(':teamId')
  async get(@Param() { teamId }: TeamIdPayloadDto) {
    return this.queryBus
      .execute(new GetTeamQuery(teamId))
      .rethrowAs(TeamNotFoundError, NotFoundException);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TeamResponseDto,
    isArray: true,
  })
  async getAll() {
    return this.queryBus.execute(new GetTeamsQuery());
  }
}
