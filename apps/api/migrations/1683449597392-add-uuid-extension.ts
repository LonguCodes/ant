import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUuidExtension1683449597392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`create extension if not exists "uuid-ossp";`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`drop extension if exists "uuid-ossp";`)
    }

}
