const Router = require("express");
const router = new Router();
const authController = require("../controller/auth.controler");

router.post("/login", authController.login);
//router.post("/register", authController.register);
module.exports = router;
