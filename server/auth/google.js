const router = require('express').Router();
const passport = require('passport');
const {User} = require('../db/models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// 1. Client request to login through Google -- `http://localhost:1337/auth/google`
router.get('/', passport.authenticate('google', { scope: 'email' }));

passport.use(
  new GoogleStrategy({
    clientID: '121877472788-hnp5fve3nksot5h0okb5obvvio3aih78.apps.googleusercontent.com',
    clientSecret: 'y5ZJ2Tct_e0btTXiNsjdiRMf',
    callbackURL: '/auth/google/verify'
  },
  /* The following callback will be used when passport successfully 
     authenticates with Google (the provider) for us, 
     using our `clientId`, `clientSecret` and the temporary token from the client
     Google sends the `token`, `refreshToken` and `profile`
     passport provides the `done` function
  */
  function (token, refreshToken, profile, done) {
    const info = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : undefined
    };
    User.findOrCreate({
      where: {googleId: profile.id}, // find this user
      defaults: info // if we don't find them, then create with this information
    })
    .spread(function (user, createdBool) {
      done(null, user);
    })
    .catch(done);
  })
);
// 2. Client hits this once they have verified with the provider (the callback URL)
   // `http://localhost:1337/auth/google/verify`
router.get('/verify',
  passport.authenticate('google', {
    successRedirect: '/', // or wherever
    failureRedirect: '/' // or wherever
  })
);

module.exports = router;