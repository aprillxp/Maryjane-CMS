const { Product, Categories, User, History } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

class Controller {
  static async getAllproducts(req, res, next) {
    try {
      const product = await Product.findAll({
        include: User,
      });
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }

  static async getOneProduct(req, res, next) {
    try {
      const perProduct = await Product.findByPk(req.params.id);
      res.status(200).json(perProduct);
    } catch (err) {
      next(err);
    }
  }

  static async postProduct(req, res, next) {
    try {
      const { name, description, price, stock, imgUrl, categoryId } = req.body;
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
        authorId: req.user.id,
      });
      let desc = `Product ${product.id} is created`;
      const history = await History.create({
        name,
        description: desc,
        updatedBy: req.user.email,
      });
      res.status(201).json({ message: `Product ${name} has been added!` });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteOneProduct(req, res, next) {
    try {
      const product = await Product.findByPk(+req.params.id);
      console.log(product);
      if (!product) {
        return res.status(404).json({
          message: `Product with id ${req.params.id} Not found`,
        });
      }
      await Product.destroy({ where: { id: +req.params.id } });
      res.status(200).json({
        message: `Product with id ${req.params.id} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByCategories(req, res, next) {
    try {
      const categories = await Categories.findAll();
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const user = await User.create({
        username,
        email,
        password,
        phoneNumber,
        address,
      });
      res
        .status(201)
        .json({ message: `User with id ${user.id} has been created` });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "Email/Password required!" };
      }

      const user = await User.findOne({
        where: { email },
      });
      // console.log(user.username);

      if (!user) {
        throw { name: "Email or Password is invalid!" };
      }

      const validPass = bcrypt.compareSync(password, user.password);
      // console.log(validPass);

      if (!validPass) {
        throw { name: "Email or Password is invalid!" };
      }

      const payload = {
        id: user.id,
      };

      const access_token = createToken(payload);

      res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res) {
    try {
      const { google_token } = req.headers;

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log(payload);

      const [user, isCreated] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: "dari_google",
          role: "staff",
        },
        hooks: false,
      });

      const access_token = createToken({
        id: user.id,
      });

      let status = 200;

      if (!isCreated) {
        status = 201;
      }
      res.status(status).json({
        access_token,
        email: user.email,
        role: user.role,
        username: user.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getHistory(req, res, next) {
    try {
      const history = await History.findAll({
        order: [["id", "DESC"]],
      });
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  static async putHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, imgUrl, categoryId } = req.body;
      const findProduct = await Product.findByPk(id);
      if (!findProduct) {
        throw { name: "Not found", id };
      }
      await Product.update(
        {
          name,
          description,
          price,
          stock,
          imgUrl,
          categoryId,
        },
        { where: { id } }
      );
      let desc = `Product with id ${id} has been updated`;
      await History.create({
        name,
        description: desc,
        updatedBy: req.user.email,
      });
      res.status(200).json({ message: "Success update product" });
    } catch (error) {
      next(error);
    }
  }

  static async patchHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const findProduct = await Product.findByPk(id);
      if (!findProduct) {
        throw { name: "Not found", id };
      }
      await Product.update(
        { status },
        {
          where: { id },
        }
      );
      let desc = `Product with ${id} status has been updated from ${findProduct.status} to ${status}`;
      await History.create({
        name: findProduct.name,
        description: desc,
        updatedBy: req.user.email,
      });
      res.status(200).json({ message: "Success update product status" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
