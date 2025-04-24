import passport from "passport";
import { findByIdUserService } from "../services/user.service";
import { config } from "./app.config";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";

interface JwtPayload {
  userId: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(
    options,
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const user = await findByIdUserService(payload.userId);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Optional: serialize/deserialize only needed if using sessions
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
});
