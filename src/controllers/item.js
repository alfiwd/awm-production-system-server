const { Op } = require("sequelize");

const { item, order_detail } = require("../../models");
const { getData, getDatas, createData, updateData, deleteData } = require("../helpers/query");
const { response } = require("../helpers/responseMessage");

module.exports = {
  getItem: async (req, res) => {
    try {
      const { id } = req.params,
        data = await item.findOne({ where: { itemId: id } });

      data ? response(res, "Success", { data }) : response(res, "Failed", { message: "Id tidak ditemukan" });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getItems: async (_, res) => {
    try {
      const datas = await item.findAll();

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getItems => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  getItemsByName: async (req, res) => {
    try {
      const { name } = req.query,
        datas = await item.findAll({ where: { name: { [Op.like]: `%${name}%` } } });

      if (!name) {
        return response(res, "Failed", { message: "Nama item tidak ditemukan" });
      }

      response(res, "Success", { data: datas });
    } catch (error) {
      console.log("error getItemsByName => ", error);
    }
  },
  getSizeByItemId: async (req, res) => {
    try {
    } catch (error) {
      console.log("error getSizeByItemName => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  createItem: async (req, res) => {
    try {
      const payload = req.body,
        getItemByName = await item.findOne({
          where: {
            name: payload.name,
          },
        });

      if (getItemByName) {
        return response(res, "Failed", { message: "Item dengan data tersebut sudah ada" });
      }

      await item.create(payload);
      response(res, "Success", { message: "Berhasil menambahkan data item" });
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  updateItem: async (req, res) => {
    try {
      const { id } = req.params,
        payload = req.body,
        data = await item.findOne({ where: { itemId: id } }),
        getItemByName = await item.findOne({ where: { name: payload.name } });

      if (data) {
        if (getItemByName) {
          return response(res, "Failed", { message: "Gagal mengubah data item, data item tersebut sudah ada" });
        }
        await item.update(payload, { where: { itemId: id } });
        response(res, "Success", { message: "Berhasil mengubah data item" });
      } else {
        response(res, "Failed", { message: "Gagal mengubah data item, id item tidak ditemukan" });
      }
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getData(item, id);

      if (data) {
        await deleteData(item, id);
        response(res, "Success", { message: "Berhasil menghapus data item list" });
      } else {
        response(res, "Failed", { message: "Gagal menghapus data item list, id item list tidak ditemukan" });
      }
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
