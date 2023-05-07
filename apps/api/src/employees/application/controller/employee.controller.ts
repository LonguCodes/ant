import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(
    @Body() { firstName, lastName, role, managerId }: CreateEmployeePayloadDto
  ) {
    return this.commandBus
      .execute(new AddEmployeeCommand(firstName, lastName, role, managerId))
      .rethrowAs(EmployeeNotFoundError, BadRequestException);
  }
  @Post(':employeeId/assign/:managerId')
  async assignManager(
    @Param() { managerId, employeeId }: AssignManagerPayloadDto
  ) {
    return this.commandBus
      .execute(new AssignManagerCommand(employeeId, managerId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @Patch(':employeeId')
  async updateEmployee(
    @Param() { employeeId }: EmployeeIdPayloadDto,
    @Body() payload: UpdateEmployeePayloadDto
  ) {
    return this.commandBus
      .execute(new UpdateEmployeeCommand(employeeId, payload))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @Delete(':employeeId')
  async deleteEmployee(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.commandBus
      .execute(new DeleteEmployeeCommand(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @Get(':employeeId/subordinates')
  async getUnderlings(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.queryBus
      .execute(new GetSubordinatesOfEmployeeQuery(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }
  @Get(':employeeId')
  async getEmployee(@Param() { employeeId }: EmployeeIdPayloadDto) {
    return this.queryBus
      .execute(new GetEmployeeQuery(employeeId))
      .rethrowAs(EmployeeNotFoundError, NotFoundException);
  }

  @Get()
  async getAllEmployees() {
    return this.queryBus.execute(new GetEmployeesQuery());
  }
}
