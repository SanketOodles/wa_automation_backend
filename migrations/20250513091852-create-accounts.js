'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      status: Sequelize.STRING,
      org_id: Sequelize.INTEGER,
      qr_session: Sequelize.TEXT,
      ip_address: Sequelize.STRING,
      location: Sequelize.STRING,
      created_by_id: Sequelize.INTEGER,
      updated_by_id: Sequelize.INTEGER,
      deleted_by_id: Sequelize.INTEGER,
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('accounts');
  }
};
