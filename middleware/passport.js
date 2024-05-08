const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const sql = require("mssql");
const db = require("../db");
const secret_key = require("../config/secret_key");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
  secretOrKey: secret_key.jwt,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const pool = await db();
        const user = await pool.query(
          'SELECT IDClient, "Email" FROM "Client" WHERE IDClient = $1',
          [payload.ID]
        );
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (ex) {
        console.log(ex);
        done(ex, false); // Правильное завершение обработки в случае ошибки
      }
    })
  );
};
