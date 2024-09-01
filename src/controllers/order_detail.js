const { Op } = require("sequelize");

const { order_detail, order, item, customer, item_detail } = require("../../models");
const { response } = require("../helpers/responseMessage");

module.exports = {
  getOrderDetails: async (_, res) => {
    try {
      const orderDetailDatas = await order_detail.findAll({
          include: [
            {
              model: order,
              as: "order",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: item,
              as: "item",
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: [
                {
                  model: item_detail,
                  as: "item_detail",
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                },
              ],
            },
          ],
        }),
        datas = await Promise.all(
          orderDetailDatas?.map(async (item) => {
            const customerData = await customer.findOne({ where: { customerId: item.dataValues.order.dataValues.customerId } });
            return { ...item.dataValues, customer: customerData };
          })
        );

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getOrderDetail => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getOrderDetailsByOrderId: async (req, res) => {
    try {
      const { orderId } = req.params,
        orderDetailDatas = await order_detail.findAll({
          where: {
            orderId: { [Op.like]: `%${orderId}%` },
          },
          include: [
            {
              model: order,
              as: "order",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: item,
              as: "item",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        }),
        datas = await Promise.all(
          orderDetailDatas?.map(async (data) => {
            const customerData = await customer.findOne({ where: { customerId: data.dataValues.order.dataValues.customerId } }),
              itemData = await item.findOne({ where: { itemId: data.dataValues.itemId } });
            return { ...data.dataValues, customer: customerData, productName: itemData.dataValues.name };
          })
        );

      if (!orderId) {
        return response(res, "Failed", { message: "Id order tidak ditemukan" });
      }

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getOrderDetailsByOrderId => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  createOrderDetail: async (req, res) => {
    try {
      const payload = req.body,
        getOrderById = await order.findOne({ where: { orderId: payload.orderId } }),
        getItemById = await item.findOne({ where: { itemId: payload.itemId } });

      if (!getOrderById || !getItemById) {
        return response(res, "Failed", { message: "Id order atau id item tidak ditemukan" });
      }

      await order_detail.create(payload);
      response(res, "Success", { message: "Berhasil menambahkan data order detail" });
    } catch (error) {
      console.log("error createOrderDetail => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  updateStatusOrderDetail: async (req, res) => {
    try {
      const { orderDetailId } = req.params,
        { status } = req.query,
        orderDetail = await order_detail.findOne({ where: { orderDetailId } });

      if (!orderDetail) {
        return response(res, "Failed", { message: "Order detail tidak ditemukan" });
      }

      await order_detail.update({ status }, { where: { orderDetailId } });

      const getOrder = await order.findOne({
          where: { orderId: orderDetail.dataValues.orderId },
          include: [
            {
              model: order_detail,
              as: "order_detail",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        }),
        totalStatusComplete = getOrder.dataValues.order_detail.filter((item) => item.status === "COMPLETE").length,
        orderDetailLength = getOrder.dataValues.order_detail.length;

      if (totalStatusComplete === orderDetailLength) {
        await order.update({ status: "READY_TO_DELIVERY" }, { where: { orderId: orderDetail.dataValues.orderId } });
      }

      response(res, "Success", { message: "Berhasil mengubah status order detail" });
    } catch (error) {
      console.log("error updateStatusOrderDetail => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
