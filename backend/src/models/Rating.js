const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'stores', key: 'id' },
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' },
      },
    },
  },
  {
    tableName: 'ratings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'storeId'],
        name: 'unique_user_store_rating',
      },
    ],
  }
);

module.exports = Rating;
