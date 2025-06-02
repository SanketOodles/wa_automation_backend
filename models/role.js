'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // One Role has many Permissions
      Role.hasMany(models.Permissions, {
        foreignKey: 'role_id',
        as: 'permissions',
      });

      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
        as: 'users'
      });
    
      Role.hasMany(models.UserRole, {
        foreignKey: 'role_id',
        as: 'user_roles'
      });
    }
  }

  Role.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
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
      modelName: 'Role',
      tableName: 'roles',
     timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Role;
};
