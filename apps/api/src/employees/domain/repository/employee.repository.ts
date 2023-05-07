import { EmployeeEntity } from '../entity/employee.entity';

export const EMPLOYEE_REPOSITORY = Symbol('employee-repository-token');
export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;
  findOneById(id: string): Promise<EmployeeEntity | undefined>;
  findDirectEmployeesOf(managerId: string): Promise<EmployeeEntity[]>;
  findEmployeesOf(managerId: string): Promise<EmployeeEntity[]>;
  save(employee: EmployeeEntity): Promise<EmployeeEntity>;
  saveMany(employees: EmployeeEntity[]): Promise<EmployeeEntity[]>;
  delete(employee: EmployeeEntity): Promise<void>;
}
