"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order", {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "customer",
          key: "customerId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: {
          model: "admin",
          key: "adminId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
      },
      proofOfDp: {
        type: Sequelize.TEXT,
      },
      proofOfReceipt: {
        type: Sequelize.TEXT,
      },
      proofOfFullPayment: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order");
  },
};
