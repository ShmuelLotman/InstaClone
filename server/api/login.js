const loginRouter = require('express').Router();
const passport = require('passport');
const User = require('../db/models/user')
loginRouter.post('/', (req, res, next) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) res.status(401).send('User not found');
        else if (!user.hasMatchingPassword(req.body.password)) {res.status(401).send('Incorrect password')}
        else {
          req.login(user, err => {
            if (err) next(err);
            else res.json(user);
          });
        }
      })
      .catch(next);
  });
loginRouter.get('/auth/google', passport.authenticate('google', { scope: 'email' }));

module.exports = loginRouter;