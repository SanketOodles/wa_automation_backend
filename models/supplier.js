'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // Define the association with Organisation
      if (models.Organisation) {
        Supplier.belongsTo(models.Organisation, {
          foreignKey: 'org_id',
          as: 'organisation',
          onDelete: 'CASCADE'
        });
      }

      // Define the association with User for created_by_id
      if (models.User) {
        Supplier.belongsTo(models.User, {
          foreignKey: 'created_by_id',
          as: 'createdBy',
          onDelete: 'SET NULL'
        });
      }

      // Define the association with User for updated_by_id
      if (models.User) {
        Supplier.belongsTo(models.User, {
          foreignKey: 'updated_by_id',
          as: 'updatedBy',
          onDelete: 'SET NULL'
        });
      }
    }
  }

  Supplier.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    org_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organisations', key: 'id' } },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    created_by_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    updated_by_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    deleted_by_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } }
  }, {
    sequelize,
    modelName: 'Supplier',
    tableName: 'suppliers',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Supplier;
};
