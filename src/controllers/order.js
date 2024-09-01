const { Op } = require("sequelize");

const { order, customer, order_detail } = require("../../models");
const { response } = require("../helpers/responseMessage");

module.exports = {
  getOrder: async (req, res) => {
    try {
      const { id } = req.params,
        data = await order.findOne({
          where: {
            orderId: id,
          },
          include: [
            {
              model: customer,
              as: "customer",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: order_detail,
              as: "order_detail",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        });

      data ? response(res, "Success", { data }) : response(res, "Failed", { message: "Id tidak ditemukan" });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getOrdersByCustomerIdQuery: async (req, res) => {
    try {
      const { customerId } = req.query,
        datas = await order.findAll({ where: customerId });

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getOrdersByCustomerIdQuery => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getOrdersBySearch: async (req, res) => {
    try {
      const { customerId, status, orderStartDate, orderEndDate } = req.query,
        whereClause = {};

      // const dateRange = (startDate, endDate) => [new Date(startDate).setHours(7, 0, 0, 0), new Date(endDate).setHours(30, 59, 59, 999)];
      const dateRange = (startDate, endDate) => [new Date(startDate).setHours(0, 0, 0, 0), new Date(endDate).setHours(23, 59, 59, 999)];

      if (customerId !== "null") whereClause.customerId = customerId;
      if (status !== "null") whereClause.status = status;
      if (orderStartDate !== "null" && orderEndDate !== "null") {
        if (orderStartDate === orderEndDate)
          whereClause.createdAt = {
            [Op.between]: dateRange(orderStartDate, orderStartDate),
          };
        else whereClause.createdAt = { [Op.between]: dateRange(orderStartDate, orderEndDate) };
      }

      const data = await order.findAll({
        where: whereClause,
        include: [
          {
            model: customer,
            as: "customer",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: order_detail,
            as: "order_detail",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      response(res, "Success", { data });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getAllOrders: async (_, res) => {
    try {
      const datas = await order.findAll({
        include: [
          {
            model: customer,
            as: "customer",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getAllOrders => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  createOrder: async (req, res) => {
    try {
      const payload = req.body,
        customerData = await customer.findOne({ where: { customerId: payload.customerId } }),
        getOrderByCustomerId = await order.findOne({ where: { customerId: payload.customerId } });
      // getOrderById = await order.findOne({ where: { orderId: payload.orderId } });

      // if (getOrderByCustomerId && getOrderById) {
      //   return response(res, "Failed", { message: "Purchase order dengan data tersebut sudah ada" });
      // }

      if (customerData) {
        const _response = await order.create(payload);

        response(res, "Success", { message: "Berhasil menambahkan data order", data: _response.dataValues });
      } else {
        response(res, "Failed", { message: "Gagal menambahkan data order, id customer tidak ditemukan" });
      }
    } catch (error) {
      console.log("error createOrder => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params,
        payload = req.body,
        data = await order.findOne({ where: { orderId: id } }),
        orderDetails = await order_detail.findAll({ where: { orderId: id } }),
        { publishPrice } = req.query;

      if (data) {
        const areThereDelete = orderDetails.length > payload.orderDetail.length,
          areThereNewData = orderDetails.length < payload.orderDetail.length;
        orderDetails?.map((item) => console.log(item.dataValues));
        console.log(payload.orderDetail);

        if (areThereDelete) {
          console.log("kondisi 1");
          const deletedData = orderDetails.filter((itemA) => !payload.orderDetail.some((itemB) => itemB.orderDetailId === itemA.orderDetailId)),
            newData = payload.orderDetail?.filter((item) => !item.orderDetailId);

          deletedData.map(async (item) => await order_detail.destroy({ where: { orderDetailId: item.dataValues.orderDetailId } }));

          if (newData) {
            console.log("kondisi 11");
            newData.map(async (item) => await order_detail.create(item));
          }
        } else if (areThereNewData) {
          console.log("kondisi 2");
          const newData = payload.orderDetail.filter((item) => !item?.orderDetailId),
            deletedData = orderDetails.filter((itemA) => !payload.orderDetail.some((itemB) => itemB.orderDetailId === itemA.orderDetailId));

          if (deletedData) {
            deletedData.map(async (item) => await order_detail.destroy({ where: { orderDetailId: item.dataValues.orderDetailId } }));
          }

          newData.map(async (item) => await order_detail.create(item));
        } else {
          if (publishPrice === "false") {
            console.log("kondisi 3");
            // payload.orderDetail.map(async (item) => await order_detail.destroy({ where: { orderId: item.orderId } }));
            orderDetails.map(async (item) => await order_detail.destroy({ where: { orderDetailId: item.dataValues.orderDetailId } }));
            payload.orderDetail.map(async (item) => await order_detail.create(item));
          }
        }

        await order.update(payload.order, { where: { orderId: id } });

        payload.orderDetail
          .filter((item) => item?.orderDetailId)
          .map(async (item) => {
            const { orderDetailId } = item;

            await order_detail.update(item, { where: { orderDetailId } });
          });

        response(res, "Success", { message: "Berhasil mengubah data order" });
      } else {
        response(res, "Failed", { message: "Gagal mengubah data order, id order tidak ditemukan" });
      }
    } catch (error) {
      console.log("error updateOrder => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  updateOrderOnly: async (req, res) => {
    try {
      const { id } = req.params,
        payload = req.body,
        data = await order.findOne({
          where: { orderId: id },
          include: [
            {
              model: order_detail,
              as: "order_detail",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        });

      if (data) {
        await order.update(payload, { where: { orderId: id } });
      }

      response(res, "Success", { message: "Berhasil mengubah data order", data });
    } catch (error) {
      console.log("error => updateOrderOnly", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
