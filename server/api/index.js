const Router = require('express').Router();

Router.use('/login', require('./login'));
Router.use('/signup', require('./signup'));
Router.use('/logout', require('./logout'));
Router.get('/me', (req, res, next) => {
    res.json(req.user);
  });
Router.get('/', (req, res, next) => {
    res.send('Welcome')
})
Router.use( (req, res, next) => {
    const err = new Error('Not found.');
    err.status = 404;
    next(err);
  });
module.exports = Router;
