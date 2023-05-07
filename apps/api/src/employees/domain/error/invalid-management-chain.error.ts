export class InvalidManagementChainError extends Error {
  constructor(employeeId: string, managerId: string) {
    super(`Employee ${employeeId} can not be a manager of ${managerId}, as he is already a subordinate`);
  }
}
