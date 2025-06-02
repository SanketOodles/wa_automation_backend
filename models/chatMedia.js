'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatMedia extends Model {
    static associate(models) {
      ChatMedia.belongsTo(models.Chat, { foreignKey: 'chat_id', as: 'chat' });
    }
  }

  ChatMedia.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    unique_file_name: DataTypes.STRING,
    file_name: DataTypes.STRING,
    bucket_name: DataTypes.STRING,
    region: DataTypes.STRING,
    type: DataTypes.STRING,
    chat_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ChatMedia',
    tableName: 'chat_medias',
    underscored: true,
    timestamps: true,
    paranoid: true,
  });

  return ChatMedia;
};
