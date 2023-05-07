import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddEmployeeTable1683449669051 implements MigrationInterface {
  table = new Table({
    name: 'employees',
    columns: [
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        isGenerated: true,
      }),
      new TableColumn({
        name: 'first_name',
        type: 'text',
      }),
      new TableColumn({
        name: 'last_name',
        type: 'text',
      }),
      new TableColumn({
        name: 'direct_manager_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'all_manager_ids',
        type: 'text',
        isArray: true,
        default: 'ARRAY[]::TEXT[]',
      }),
      new TableColumn({
        name: 'first_day_at_work',
        type: 'date',
        default: 'CURRENT_DATE',
      }),
      new TableColumn({
        name: 'role',
        type: 'text',
      }),
    ],
    foreignKeys: [
      new TableForeignKey({
        name: 'IDX_EMPLOYEE_MANAGER',
        columnNames: ['direct_manager_id'],
        referencedTableName: 'employees',
        referencedColumnNames: ['id'],
      })
    ]
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
