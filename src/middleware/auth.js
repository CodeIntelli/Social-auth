import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config"
import {SocialauthModel} from "../models"
const authMiddleware = passport.use(new GoogleStrategy.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2020/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        try {
            const id = profile.id 
            const name = profile.displayName
            const user = new SocialauthModel({
                googleId: id,
                name:name
            })
            user.save()
            return done(null, profile)
        }
        catch (err)
        {
            return done(err);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

export default authMiddleware;