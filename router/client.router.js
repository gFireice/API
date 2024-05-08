const passport = require("passport");
const Router = require("express");
const router = new Router();
const clientController = require("../controller/client.controller");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  clientController.getCleints
);
// router.get("/", clientController.getCleints);
router.get("/:id", clientController.getOneCleint);
router.get("/adm/:id", clientController.getAdmCleint);

module.exports = router;
