const express = require("express");
const http = require("http");

const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");
//----------------------------------
const clientRouter = require("./router/client.router");
const authRouter = require("./router/auth.router");
const musicianRouster = require("./router/musician.router");
const concertRouster = require("./router/concert.router");
const organizationRouster = require("./router/organization.router");
const placeRouster = require("./router/place.router");
const orderRouster = require("./router/order.router");

const app = express();

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const moscowTimezone = "Europe/Moscow";

// Middleware for logging
app.use(
  morgan((tokens, req, res) => {
    return [
      moment().tz(moscowTimezone).format(), // Moscow time
      tokens["remote-addr"](req, res),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens["response-time"](req, res),
      "ms",
      "-",
      tokens.res(req, res, "content-length"),
    ].join(" ");
  })
);

// Middleware to log request body for POST requests
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("POST request body:", req.body);
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/uploads", express.static("uploads"));
app.use("/api/user", clientRouter);
app.use("/api/auth", authRouter);
app.use("/api/musician", musicianRouster);
app.use("/api/concert", concertRouster);
app.use("/api/organization", organizationRouster);
app.use("/api/place", placeRouster);
app.use("/api/order", orderRouster);

const PORT = process.env.PORT || 8085;
const HOST = process.env.HOST || ["95.165.143.19", "0.0.0.0"];

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT} and on host ${HOST}.`);
});
