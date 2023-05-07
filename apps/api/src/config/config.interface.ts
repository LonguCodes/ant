export interface ConfigInterface {
  database: {
    password: string;
    username: string;
    database: string;
    port: number;
    host: string;
    migrationsRun: boolean;
  };
}
