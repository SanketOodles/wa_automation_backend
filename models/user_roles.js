'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {

        UserRole.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
          });
        
          UserRole.belongsTo(models.Role, {
            foreignKey: 'role_id',
            as: 'role'
          });
    }
  }

  UserRole.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: DataTypes.INTEGER,
      role_id:DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
      created_by_id: DataTypes.INTEGER,
      updated_by_id: DataTypes.INTEGER,
      deleted_by_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserRole',
      tableName: 'user_roles',
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return UserRole;
};

