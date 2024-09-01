const jwt = require("jsonwebtoken");

module.exports = {
  auth: async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({ status: "Failed", message: "Access denied!" });
    }

    try {
      const verified = jwt.verify(token, process.env.AUTH_SECRET_KEY);

      req.user = verified;

      next();
    } catch (error) {
      console.log("error => ", error);
      res.status(400).send({ status: "Failed", message: "Invalid token" });
    }
  },
};
