'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatTemplate extends Model {
    static associate(models) {
      ChatTemplate.belongsTo(models.Channel, { foreignKey: 'channel_id', as: 'channels' });
    }
  }

  ChatTemplate.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    channel_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ChatTemplate',
    tableName: 'chat_templates',
    underscored: true,
    timestamps: true,
    paranoid: true,
  });

  return ChatTemplate;
};