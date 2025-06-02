'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      module_name: Sequelize.STRING,
      status: Sequelize.STRING,
      role_id: Sequelize.INTEGER,
      parent_permission_id: Sequelize.INTEGER,
      is_create: Sequelize.BOOLEAN,
      is_update: Sequelize.BOOLEAN,
      is_delete: Sequelize.BOOLEAN,
      is_read: Sequelize.BOOLEAN,
      created_by_id: Sequelize.INTEGER,
      updated_by_id: Sequelize.INTEGER,
      deleted_by_id: Sequelize.INTEGER,
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('permissions');
  }
};
