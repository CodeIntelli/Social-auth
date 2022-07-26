import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config"
import { SocialauthModel } from "../models";
const authMiddleware = passport.use(new GoogleStrategy.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2020/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            const id = profile.id;
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const profilePhoto = profile.photos[0].value;
            const source = "google";
            
            const userData = new SocialauthModel({
                googleId: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                profilePhoto: profilePhoto,
                password: id,
                source: source,
                googleVerified:true
            })
            
            userData.save();
            return done(null, userData);
        }
        catch (err) {
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