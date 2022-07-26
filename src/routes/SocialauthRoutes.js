import express from 'express';
import session from 'express-session';
import { authMiddleware } from "../middleware"
import passport from 'passport';
const SocialRoutes = express.Router();

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

SocialRoutes.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
SocialRoutes.use(passport.initialize());
SocialRoutes.use(passport.session());

SocialRoutes.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

SocialRoutes.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

SocialRoutes.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure'
    })
);

SocialRoutes.get('/protected', isLoggedIn, (req, res) => {

    res.send(`Hello ${req.user.firstName}`);
});

SocialRoutes.get('/logout', (req, res) => {
    req.logut();
    req.session.destroy();
    res.send('Goodbye!');
});

SocialRoutes.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

export default SocialRoutes;