export class EmployeeWithoutTeamError extends Error {
  constructor(employeeId: string) {
    super(`Employee does not belong to a team`);
  }
}
