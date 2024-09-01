"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_detail.belongsTo(models.order, {
        as: "order",
        foreignKey: {
          name: "orderId",
        },
      });
      order_detail.belongsTo(models.item, {
        as: "item",
        foreignKey: {
          name: "itemId",
        },
      });
    }
  }
  order_detail.init(
    {
      orderDetailId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      quantity: DataTypes.INTEGER,
      color: DataTypes.STRING,
      status: DataTypes.STRING,
      description: DataTypes.STRING,
      sample: DataTypes.TEXT,
      size: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order_detail",
      tableName: "order_detail",
      freezeTableName: true,
    }
  );
  return order_detail;
};
