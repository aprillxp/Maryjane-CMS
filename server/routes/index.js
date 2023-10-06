const express = require("express");
const Controller = require("../controllers/controller");
const { authentication } = require("../middlewares/authentication");
const {
  authorization,
  authorizationAdmin,
} = require("../middlewares/authorization");
const router = express.Router();
const publicRouter = require("./publicRoutes");
const errorHandlers = require("../middlewares/errorHandlers.js");

router.use("/pub", publicRouter);

// feature regis/login
router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/google-login", Controller.googleLogin);

//middleware
router.use(authentication);

// create, read, delete data
router.get("/products", Controller.getAllproducts);
router.post("/products", Controller.postProduct);
router.get("/products/:id", Controller.getOneProduct);

//update entity
router.get("/history", Controller.getHistory);
router.put("/products/:id", authorization, Controller.putHistory);

// update status only for admin
router.patch("/products/:id", authorizationAdmin, Controller.patchHistory);

//delete data
router.delete("/products/:id", authorization, Controller.deleteOneProduct);

//read by categories
router.get("/categories", Controller.getByCategories);

//error handler
router.use(errorHandlers);

module.exports = router;
