'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
        Account.belongsTo(models.Organisation, {
            foreignKey: 'org_id',
            as: 'organisation',
          });
          
        Account.hasMany(models.Channel, { 
            foreignKey: 'acc_id', 
            as: 'channels' 
        });
    }
  }

  Account.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      org_id: DataTypes.INTEGER,
      qr_session: DataTypes.TEXT,
      status: DataTypes.STRING,
      ip_address: DataTypes.STRING,
      location: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
      created_by_id: DataTypes.INTEGER,
      updated_by_id: DataTypes.INTEGER,
      deleted_by_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Account;
};
