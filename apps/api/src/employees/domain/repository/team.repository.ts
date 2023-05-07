import { TeamEntity } from '../entity/team.entity';

export const TEAM_REPOSITORY = Symbol('team-repository-token');
export interface ITeamRepository {
  findOneById(id: string): Promise<TeamEntity | undefined>;
  findAll(): Promise<TeamEntity[]>
  save(team: TeamEntity): Promise<TeamEntity>;
  delete(team: TeamEntity): Promise<void>;
}
