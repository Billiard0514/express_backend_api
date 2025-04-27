import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/userModel';
import { JWT_SECRET } from './global';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
    secretOrKey: JWT_SECRET || 'default_secret', // Use the same secret as in authController
};

passport.use(
    new Strategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id); // Find user by ID in the token payload
            if (user) {
                return done(null, user); // Attach user to req.user
            } else {
                return done(null, false); // No user found
            }
        } catch (error) {
            return done(error, false); // Handle errors
        }
    })
);
