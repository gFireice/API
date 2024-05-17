const passport = require("passport");
const Router = require("express");
const router = new Router();
const OrderController = require("../controller/order.controller");

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   clientController.getCleints
// );
router.get("/", OrderController.getOrder);
router.get("/:id", OrderController.getOneOrder);
router.post("/", OrderController.createOrder);

module.exports = router;
