const { Op } = require("sequelize");

const { customer } = require("../../models");
const { response } = require("../helpers/responseMessage");

module.exports = {
  getCustomer: async (req, res) => {
    try {
      const { id } = req.params,
        data = await customer.findOne({ where: { customerId: id } });

      data ? response(res, "Success", { data }) : response(res, "Failed", { message: "Id customer tidak ditemukan" });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getCustomerByName: async (req, res) => {
    try {
      const { name } = req.query,
        datas = await customer.findAll({ where: { name: { [Op.like]: `%${name}%` } } });

      if (!name) {
        return response(res, "Failed", { message: "Nama customer tidak ditemukan" });
      }
      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getCustomerByName => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getCustomers: async (_, res) => {
    try {
      const datas = await customer.findAll();

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  createCustomer: async (req, res) => {
    try {
      const payload = req.body,
        // existingCustomer = await customer.findOne({
        //   where: {
        //     [Op.and]: [{ name: payload.name }, { address: payload.address }],
        //   },
        // });
        existingCustomer = await customer.findOne({
          where: {
            email: payload.email,
          },
        });

      if (existingCustomer) {
        return response(res, "Failed", { message: "Customer dengan data tersebut sudah ada" });
      }

      await customer.create(payload);
      response(res, "Success", { message: "Berhasil menambahkan data customer" });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params,
        payload = req.body,
        customerData = await customer.findOne({ where: { customerId: id } }),
        existingCustomer = await customer.findOne({
          where: {
            [Op.and]: [{ name: payload.name }, { address: payload.address }],
          },
        });

      if (customerData) {
        if (existingCustomer) {
          return response(res, "Failed", { message: "Customer dengan data tersebut sudah ada" });
        }

        await customer.update(payload, { where: { customerId: id } });
        response(res, "Success", { message: "Berhasil mengubah data customer" });
      } else {
        response(res, "Failed", { message: `Gagal mengubah data customer, id customer tidak ditemukan` });
      }
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
