export class TeamNotFoundError extends Error {
  constructor(teamId: string) {
    super(`Team with id ${teamId} does not exist`);
  }
}
