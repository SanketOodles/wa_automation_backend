'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatAILog extends Model {
    static associate(models) {
      ChatAILog.belongsTo(models.Chat, { foreignKey: 'chat_id', as: 'chat' });
    }
  }

  ChatAILog.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ai_request: DataTypes.TEXT,
    ai_response: DataTypes.TEXT,
    chat_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    crm_type: DataTypes.STRING,
    is_synced: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ChatAILog',
    tableName: 'chat_ai_logs',
    underscored: true,
    timestamps: true,
    paranoid: true,
  });

  return ChatAILog;
};
