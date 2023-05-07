import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddTeamTable1683492235081 implements MigrationInterface {
  table = new Table({
    name: 'teams',
    columns: [
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        isGenerated: true,
      }),
      new TableColumn({
        name: 'name',
        type: 'text',
      }),
    ],
  });

  column = new TableColumn({
    name: 'team_id',
    isNullable: true,
    type: 'uuid',
  });
  foreignKey = new TableForeignKey({
    name: 'IDX_EMPLOYEE_TEAM',
    columnNames: ['team_id'],
    referencedTableName: 'teams',
    referencedColumnNames: ['id'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.addColumn('employees', this.column);
    await queryRunner.createForeignKey('employees', this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('employees', this.foreignKey);
    await queryRunner.dropColumn('employees', this.column);
    await queryRunner.dropTable(this.table);
  }
}
