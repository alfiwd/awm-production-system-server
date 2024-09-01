const joi = require("joi"),
  jwt = require("jsonwebtoken");

const { admin, customer } = require("../../models"),
  { response } = require("../helpers/responseMessage");

module.exports = {
  login: async (req, res) => {
    try {
      const payload = req.body,
        schema = joi.object({
          email: joi.string().min(5).required(),
          password: joi.string().min(5).required(),
        }),
        { error } = schema.validate(payload);

      if (error) {
        return res.status(400).send({
          status: "Failed",
          message: error?.details?.[0]?.message,
        });
      }

      const isUserExist = payload.email.includes("@ajengwahyumanunggal.com")
        ? await admin.findOne({
            where: {
              email: payload.email,
            },
          })
        : await customer.findOne({
            where: {
              email: payload.email,
            },
          });

      if (!isUserExist) {
        return res.status(400).send({
          status: "Failed",
          message: "Email atau password tidak cocok",
        });
      }

      if (isUserExist.password === payload.password) {
        const dataToken = {
            id: isUserExist.id,
          },
          token = jwt.sign(dataToken, process.env.AUTH_SECRET_KEY);

        response(res, "Success", { token, data: isUserExist });
      } else {
        res.status(400).send({
          status: "Failed",
          message: "Email atau password tidak cocok",
        });
      }
    } catch (error) {
      console.log("error => ", error);
      response(res, "Failed", { message: "Server error", error });
    }
  },
  checkToken: async (_, res) => {
    try {
      response(res, "Success", { message: "Access granted!" });
    } catch (error) {
      console.log("error");
      response(res, "Failed", { message: "Server error", error });
    }
  },
};
