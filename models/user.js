'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
        as: 'roles'
      });
    
      User.hasMany(models.UserRole, {
        foreignKey: 'user_id',
        as: 'user_roles'
      });

      User.hasMany(models.UserActivity, {
        foreignKey: 'user_id',
        as: 'user_activities'
      });

      User.belongsTo(models.Organisation, {
        foreignKey: 'org_id',
        as: 'organisation'
      });
    }
  }
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    hash_password: { type: DataTypes.STRING },
    org_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING },
    acc_limit: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    deleted_at: { type: DataTypes.DATE },
    created_by_id: { type: DataTypes.INTEGER },
    updated_by_id: { type: DataTypes.INTEGER },
    deleted_by_id: { type: DataTypes.INTEGER }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
      underscored: true,
      paranoid: true,
  });
  return User;
};