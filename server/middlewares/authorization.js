const { Product } = require("../models");

async function authorization(req, res, next) {
  try {
    const { id } = req.params;
    const findProduct = await Product.findByPk(id);
    if (!findProduct) {
      throw { name: "Not found", id: id };
    }
    if (req.user.role !== "Admin") {
      if (req.user.id !== findProduct.authorId) {
        throw { name: "Forbidden" };
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function authorizationAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const findProduct = await Product.findByPk(id);
    if (!findProduct) {
      throw { name: "Not found", id: id };
    }
    if (req.user.role !== "Admin") {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authorization, authorizationAdmin };
