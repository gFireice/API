const passport = require("passport");
const Router = require("express");
const router = new Router();
const organizationController = require("../controller/organization.controller");

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   clientController.getCleints
// );
router.get("/", organizationController.getOrganiszation);
router.get("/:id", organizationController.getOneOrganiszation);

module.exports = router;
