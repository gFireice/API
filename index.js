const express = require("express");
//const http = require("http");
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const clientRouter = require("./router/client.router");
const authRouter = require("./router/auth.router");
const musicianRouster = require("./router/musician.router");

const app = express();

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(require("morgan")("dev"));
app.use(
  morgan(
    ":remote-addr :method :url :status :response-time ms - :res[content-length]"
  )
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", clientRouter);
app.use("/api/auth", authRouter);
app.use("/api/musician", authRouter);

const PORT = process.env.PORT || 8085;
const HOST = process.env.HOST || ["192.168.1.65", "25.30.236.198", "localhost"];

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}.`);
});
