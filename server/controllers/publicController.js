const { Product, Categories, Customer, Bookmark } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

require("dotenv").config();

class PublicController {
  static async getPubProduct(req, res, next) {
    try {
      const { page, filter } = req.query;

      let obj = {
        include: Categories,
        where: {
          status: "Active",
        },
        limit: 8,
      };

      if (page) {
        obj.offset = (page - 1) * 8;
      }

      if (filter) {
        obj.where.categoryId = filter;
      }

      const product = await Product.findAll(obj);
      res.status(200).json(product);
    } catch (err) {
      console.log(err, "di sini");
      next(err);
    }
  }

  static async getOnePubProduct(req, res, next) {
    try {
      const perProduct = await Product.findByPk(req.params.id);

      // const { location } = req.headers;

      const { data } = await axios({
        url: `https://api.qr-code-generator.com/v1/create?access-token=${process.env.QR_KEY}`,
        method: "post",
        data: {
          frame_name: "no-frame",
          qr_code_text: `http://localhost:5173/detail/${req.params.id}`,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        },
      });

      res.status(200).json({ perProduct, data });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getBookmark(req, res, next) {
    try {
      const bookmark = await Bookmark.findAll({
        include: Product,
        where: {
          CustomerId: req.customer.id,
        },
      });

      res.status(200).json(bookmark);
    } catch (err) {
      next(err);
    }
  }

  static async postBookmark(req, res, next) {
    try {
      const { ProductId } = req.params;

      const product = await Product.findOne({
        where: {
          id: ProductId,
          status: "Active",
        },
      });

      if (!product) {
        throw { name: "Not found" };
      }

      const perBookmark = await Bookmark.findByPk(product.id);

      if (perBookmark) {
        if (perBookmark.CustomerId === req.customer.id) {
          res.status(200).json({ message: "Added to bookmark" });
        } else {
          const bookmark = await Bookmark.create({
            ProductId,
            CustomerId: req.customer.id,
          });
          res.status(201).json(bookmark);
        }
      } else {
        const bookmark = await Bookmark.create({
          ProductId,
          CustomerId: req.customer.id,
        });
        res.status(201).json(bookmark);
      }
    } catch (err) {
      next(err);
    }
  }

  static async pubRegister(req, res, next) {
    try {
      const { email, password } = req.body;

      const customer = await Customer.create({
        email,
        password,
      });
      res.status(201).json(customer);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async pubLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "Email/Password required!" };
      }

      if (!password) {
        throw { name: "Email/Password required!" };
      }

      const customer = await Customer.findOne({
        where: { email },
      });

      if (!customer) {
        throw { name: "Email or Password is invalid!" };
      }

      const validPass = bcrypt.compareSync(password, customer.password);

      if (!validPass) {
        throw { name: "Email or Password is invalid!" };
      }

      const payload = {
        id: customer.id,
      };

      const access_token = createToken(payload);

      res.status(200).json({
        email: customer.email,
        role: customer.role,
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async pubGoogleLogin(req, res) {
    try {
      const { google_token } = req.headers;

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const [customer, isCreated] = await Customer.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          password: "dari_google",
          role: "staff",
        },
        hooks: false,
      });

      const access_token = createToken({
        id: customer.id,
      });

      let status = 200;

      if (!isCreated) {
        status = 201;
      }
      res.status(status).json({
        access_token,
        email: customer.email,
        role: customer.role,
        username: customer.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = PublicController;
