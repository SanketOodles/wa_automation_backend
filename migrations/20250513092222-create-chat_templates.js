'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_templates', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: Sequelize.STRING,
      content: Sequelize.TEXT,
      channel_id: Sequelize.INTEGER,
      status: Sequelize.STRING,
      created_by_id: Sequelize.INTEGER,
      updated_by_id: Sequelize.INTEGER,
      deleted_by_id: Sequelize.INTEGER,
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('chat_templates');
  }
};
