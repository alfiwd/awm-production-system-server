"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      item.hasMany(models.order_detail, {
        as: "order_detail",
        foreignKey: {
          name: "itemId",
        },
      });
    }
  }
  item.init(
    {
      itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "item",
      tableName: "item",
      freezeTableName: true,
    }
  );
  return item;
};
