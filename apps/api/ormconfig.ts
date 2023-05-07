import * as dotenv from 'dotenv';
import { configSchema } from './src/config/config.schema';
import {entities, migrations} from './src/config/entities.config';
import { DataSource } from 'typeorm';
import { ConfigFactory } from '@longucodes/config';

dotenv.config();
const config = new ConfigFactory(configSchema).config as any;

const databaseConfig = {
  type: 'postgres',
  ...config.database,
  migrations: migrations,
  entities: entities
};

export default new DataSource(databaseConfig);
