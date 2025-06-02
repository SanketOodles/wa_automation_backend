'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_medias', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      unique_file_name: Sequelize.STRING,
      file_name: Sequelize.STRING,
      bucket_name: Sequelize.STRING,
      region: Sequelize.STRING,
      type: Sequelize.STRING,
      chat_id: Sequelize.INTEGER,
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
    await queryInterface.dropTable('chat_medias');
  }
};
