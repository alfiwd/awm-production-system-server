const { item, item_detail } = require("../../models");
const { createData } = require("../helpers/query");
const { response } = require("../helpers/responseMessage");

module.exports = {
  createItemDetail: async (req, res) => {
    try {
      const payload = req.body;

      await item_detail.create(payload);
      response(res, "Success", { message: "Berhasil menambahkan data item detail" });
    } catch (error) {
      console.log("error createItemDetail => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
