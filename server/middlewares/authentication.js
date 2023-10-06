const { verifyToken } = require("../helpers/jwt");
const { User, Customer } = require("../models");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "unauthenticated" };
    }
    const payload = verifyToken(access_token);

    const findUser = await User.findByPk(payload.id);
    if (!findUser) {
      throw { name: "unauthenticated" };
    }

    req.user = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function authenticationCustomer(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "unauthenticated" };
    }
    const payload = verifyToken(access_token);

    const findCustomer = await Customer.findByPk(payload.id);
    if (!findCustomer) {
      throw { name: "unauthenticated" };
    }

    req.customer = {
      id: findCustomer.id,
      email: findCustomer.email,
      role: findCustomer.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authentication, authenticationCustomer };
