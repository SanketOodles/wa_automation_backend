'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Channel relationship
      Chat.belongsTo(models.Channel, { 
        foreignKey: 'channel_id', 
        as: 'channel',
        onDelete: 'CASCADE'
      });

      // Parent chat relationship (for threaded messages)
      Chat.belongsTo(models.Chat, { 
        foreignKey: 'parent_chat_id', 
        as: 'parentChat',
        onDelete: 'CASCADE'
      });

      // Child chats (replies)
      Chat.hasMany(models.Chat, {
        foreignKey: 'parent_chat_id',
        as: 'replies'
      });

      // Chat media relationship
      Chat.hasMany(models.ChatMedia, { 
        foreignKey: 'chat_id', 
        as: 'chatMedias',
        onDelete: 'CASCADE'
      });

      // AI logs relationship
      Chat.hasMany(models.ChatAILog, { 
        foreignKey: 'chat_id', 
        as: 'chatAILogs',
        onDelete: 'CASCADE'
      });

      // Organization relationship
      Chat.belongsTo(models.Organisation, {
        foreignKey: 'org_id',
        as: 'organisation',
        onDelete: 'CASCADE'
      });

      // Product relationship (for product-related chats)
      Chat.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'SET NULL'
      });
    }
  }

  Chat.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    original_message: DataTypes.TEXT,
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    channel_id: DataTypes.INTEGER,
    org_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    is_ai_processed: DataTypes.BOOLEAN,
    parent_chat_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    underscored: true,
    timestamps: true,
    paranoid: true,
  });

  return Chat;
};