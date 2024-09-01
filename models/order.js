"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.hasMany(models.order_detail, {
        as: "order_detail",
        foreignKey: {
          name: "orderId",
        },
      });
      order.belongsTo(models.customer, {
        as: "customer",
        foreignKey: {
          name: "customerId",
        },
      });
      order.belongsTo(models.admin, {
        as: "admin",
        foreignKey: {
          name: "adminId",
        },
      });
    }
  }
  order.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      proofOfDp: DataTypes.TEXT,
      proofOfReceipt: DataTypes.TEXT,
      proofOfFullPayment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "order",
      tableName: "order",
      freezeTableName: true,
    }
  );
  return order;
};
