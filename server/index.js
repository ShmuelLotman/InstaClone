//requires
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/index');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const User = require('./db/models/user')
//instantiation
const app = express();
const dbStore = new SequelizeStore({ db: db });

//middleware
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  store: dbStore,
  secret: process.env.SESSION_SECRET || 'a wildly insecure one',
  resave: false,
  saveUninitialized: false
}));
dbStore.sync()

//passport information
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});
//Port and Listen
const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!
db.sync()
.then(app.listen(port, function () {
  console.log("Knock, knock");
  console.log("Who's there?");
  console.log(`Your server, listening on port ${port}`);
  console.log(process.env)
}));

//Route Detour
app.use('/api', require('./api'));
app.use('/auth', require('./auth'));

//SPA Index.html Rendering
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });