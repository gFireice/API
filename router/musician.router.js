//const passport = require("passport");
const Router = require("express");
const router = new Router();
const musicianController = require("../controller/musician.controller");

router.get("/", musicianController.getMusician);
router.get("/:id", musicianController.getOneMusician);

module.exports = router;
