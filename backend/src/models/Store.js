const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Store = sequelize.define(
  'Store',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: { args: [20, 60], msg: 'Store name must be between 20 and 60 characters' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: { args: [1, 400], msg: 'Address cannot exceed 400 characters' },
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    tableName: 'stores',
    timestamps: true,
  }
);

module.exports = Store;
