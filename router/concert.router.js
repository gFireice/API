//const passport = require("passport");
const Router = require("express");
const router = new Router();
const ConcertController = require("../controller/concert.controller");

router.get("/", ConcertController.getConcert);
router.get("/:id", ConcertController.getOneConcert);

module.exports = router;
