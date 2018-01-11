const logoutRouter = require('express').Router();
const User = require('../db/models/user');

logoutRouter.post('/', (req, res, next) => {
    req.logout();
    res.sendStatus(200);
  });

module.exports = logoutRouter;