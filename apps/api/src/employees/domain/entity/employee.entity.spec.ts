import { makeBuilder } from '@ant-recruitment/test';
import { EmployeeEntity } from './employee.entity';
import { faker } from '@faker-js/faker';

describe('EmployeeEntity', () => {
  const builder = makeBuilder(EmployeeEntity, () => ({
    id: faker.datatype.uuid(),
  }));

  describe('assignManager', () => {
    it('should assign a new manager', () => {
      const manager = builder.create();
      const employee = builder.create();

      // Act
      employee.assignManager(manager);

      // Assert
      expect(employee.directManagerId).toEqual(manager.id);
      expect(employee.directManager).toEqual(manager);
      expect(employee.events).toHaveLength(1);
    });

    it('should not change anything if the manager is the same', () => {
      // Arrange
      const manager = builder.create();
      const employee = builder.create({
        directManager: manager,
        directManagerId: manager.id,
      });

      // Act
      employee.assignManager(manager);

      // Assert
      expect(employee.directManagerId).toEqual(manager.id);
      expect(employee.directManager).toEqual(manager);
      expect(employee.events).toHaveLength(0);
    });

    it('should throw an error if the assignee is a manager of the assigned', () => {
      const manager1 = builder.create();
      const manager2 = builder.create({
        directManager: manager1,
        allManagerIds: [manager1.id],
      });
      const employee = builder.create({
        directManager: manager2,
        allManagerIds: [manager1.id, manager2.id],
      });

      expect(() => manager1.assignManager(employee)).toThrowError(
        'Oops | TODO'
      );
    });
  });
});
