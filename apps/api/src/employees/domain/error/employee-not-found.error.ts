export class EmployeeNotFoundError extends Error {
  constructor(employeeId: string) {
    super(`Employee with id ${employeeId} does not exist`);
  }
}
