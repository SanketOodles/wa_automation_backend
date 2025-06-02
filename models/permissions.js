'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    static associate(models) {
      // Many Permissions belong to one Role
      Permissions.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });

      // A Permission may have a parent Permission (self-reference)
      Permissions.belongsTo(models.Permissions, {
        foreignKey: 'parent_permission_id',
        as: 'parentPermission',
      });

      // A Permission can have many child permissions
      Permissions.hasMany(models.Permissions, {
        foreignKey: 'parent_permission_id',
        as: 'childPermissions',
      });
    }
  }

  Permissions.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      module_name: DataTypes.STRING,
      status: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      parent_permission_id: DataTypes.INTEGER,
      is_create: DataTypes.BOOLEAN,
      is_update: DataTypes.BOOLEAN,
      is_delete: DataTypes.BOOLEAN,
      is_read: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
      created_by_id: DataTypes.INTEGER,
      updated_by_id: DataTypes.INTEGER,
      deleted_by_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Permissions',
      tableName: 'permissions',
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Permissions;
};
