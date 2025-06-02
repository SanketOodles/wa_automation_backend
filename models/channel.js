'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      Channel.belongsTo(models.Account, { foreignKey: 'acc_id', as: 'account' });
      Channel.belongsTo(models.Organisation, { foreignKey: 'org_id', as: 'organisation' });
      Channel.hasMany(models.Chat, { foreignKey: 'channel_id', as: 'chats' });
      Channel.hasMany(models.ChatTemplate, { foreignKey: 'channel_id', as: 'chatTemplates' });
    }
  }

  Channel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    acc_id: DataTypes.INTEGER,
    org_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    is_subscribed: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Channel',
    tableName: 'channels',
    underscored: true,
    timestamps: true,
    paranoid: true,
  });

  return Channel;
};
