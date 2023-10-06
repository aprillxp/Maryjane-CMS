const express = require("express");
const PublicController = require("../controllers/publicController");
const publicRouter = express.Router();
const { authenticationCustomer } = require("../middlewares/authentication");

// register / login
publicRouter.post("/register", PublicController.pubRegister);
publicRouter.post("/login", PublicController.pubLogin);
publicRouter.post("/google-login", PublicController.pubGoogleLogin);

// public product
publicRouter.get("/products", PublicController.getPubProduct);
publicRouter.get("/products/:id", PublicController.getOnePubProduct);

// authentication
publicRouter.use(authenticationCustomer)

// bookmark
publicRouter.get("/bookmarks", PublicController.getBookmark);
publicRouter.post("/bookmarks/:ProductId", PublicController.postBookmark);

module.exports = publicRouter;
