import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigToken } from '@longucodes/config';
import { configSchema } from '../config/config.schema';
import { ConfigInterface } from '../config/config.interface';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { EmployeeModule } from '../employees/employee.module';
import { entities, migrations } from '../config/entities.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      schema: configSchema,
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigToken],
      useFactory: (config: ConfigInterface) => {
        return { type: 'postgres', ...config.database, migrations, entities };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    EmployeeModule,
  ],
})
export class AppModule {}
