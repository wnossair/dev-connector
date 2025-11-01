import passport, { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { User } from "../models/User.js";
import { IUser } from "../types/models.js";
import keys from "./keys.js";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

export default (passport: PassportStatic): void => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.error("Error in JWT Strategy user lookup:", err);
        return done(err, false);
      }
    })
  );
};
