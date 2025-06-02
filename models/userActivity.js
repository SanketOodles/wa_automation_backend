'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
    static associate(models) {
      // Each activity belongs to a user
      UserActivity.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  UserActivity.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: DataTypes.INTEGER,
    api_request_url: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER,
    deleted_by_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'user_activities',
    timestamps: true,
    underscored: true,
  });

  return UserActivity;
};
