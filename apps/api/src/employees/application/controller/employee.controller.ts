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
import { TeamResponseDto } from '../response/team.response.dto';
import { GetTeamByEmployeeQuery } from '../../domain/query/get-team-by-employee.query';
import { TeamNotFoundError } from '../../domain/error/team-not-found.error';
import { EmployeeWithoutTeamError } from '../../domain/error/employee-without-team.error';
import { AssignToTeamPayloadDto } from '../payload/assign-to-team.payload.dto';
import { AssignToTeamCommand } from '../../domain/command/assign-to-team.command';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdPayload,
    description: 'Employee created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Employee specified by manager id does not exist',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() { firstName, lastName, role, managerId }: CreateEmployeePayloadDto
  ) {
    return this.commandBus
      .execute(new AddEmployeeCommand(firstName, lastName, role, managerId))
      .transform(IdPayload)
      .rethrowAs(EmployeeNotFoundError, BadRequestException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Manager assigned',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee does not exist',
  })
  @Post(':employeeId/assign/:managerId')
  @HttpCode(HttpStatus.OK)
  async assignManager(
    @Param() { managerId, employeeId }: AssignManagerPayloadDto
  ) {
    return this.commandBus
      .execute(new AssignManagerCommand(employeeId, managerId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee does not exist',
  })
  @Patch(':employeeId')
  @HttpCode(HttpStatus.OK)
  async updateEmployee(
    @Param() { employeeId }: EmployeeIdPayloadDto,
    @Body() payload: UpdateEmployeePayloadDto
  ) {
    return this.commandBus
      .execute(new UpdateEmployeeCommand(employeeId, payload))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee does not exist',
  })
  @Delete(':employeeId')
  async deleteEmployee(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.commandBus
      .execute(new DeleteEmployeeCommand(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee does not exist',
  })
  @Get(':employeeId/subordinates')
  async getUnderlings(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.queryBus
      .execute(new GetSubordinatesOfEmployeeQuery(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee does not exist',
  })
  @Get(':employeeId')
  async getEmployee(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.queryBus
      .execute(new GetEmployeeQuery(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmployeeResponseDto,
    isArray: true,
  })
  async getAllEmployees() {
    return this.queryBus.execute(new GetEmployeesQuery());
  }

  @Get(':employeeId/team')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TeamResponseDto,
    isArray: true,
  })
  async getTeam(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.queryBus
      .execute(new GetTeamByEmployeeQuery(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException)
      .rethrowAs(TeamNotFoundError, NotFoundException)
      .rethrowAs(EmployeeWithoutTeamError, NotFoundException);
  }

  @Post(':employeeId/team/:teamId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee assigned to team',
  })
  async assignToTeam(@Param() { employeeId, teamId }: AssignToTeamPayloadDto) {
    return this.commandBus
      .execute(new AssignToTeamCommand(employeeId, teamId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException)
      .rethrowAs(TeamNotFoundError, NotFoundException);
  }
}
