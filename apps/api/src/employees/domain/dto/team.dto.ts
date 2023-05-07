import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TeamDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
