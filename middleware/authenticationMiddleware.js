const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "assessment");
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Please login to peform this action" });
  }
};

module.exports = authenticateUser
