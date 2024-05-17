const passport = require("passport");
const Router = require("express");
const router = new Router();
const PlaceController = require("../controller/place.controller");

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   clientController.getCleints
// );
router.get("/", PlaceController.getPlace);
router.get("/:id", PlaceController.getOnePlace);

module.exports = router;
