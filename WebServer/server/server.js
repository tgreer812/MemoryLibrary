// server/index.js

const express = require("express");
const passport = require('./middleware/passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();
const {database, dbConnect, isDatabaseEnabled} = require('./utility/db');
const apiRouter = require('./routes/api');

// MIDDLEWARE

app.use(bodyParser.json());

// CHANGE THIS TO SECURE CONFIG!
app.use(cors({
  origin: ['http://127.0.0.1:3000',  'http://localhost:3000']
}));


app.use(session({
  secret: 'a-$uP3r-S^cRet-K3y22',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'strict',
  },
  logFn: function () {},
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

// If you want to disable a database, go to the db.js file and set the databaseEnabled variable to false.
dbConnect().then(() => {
  if (isDatabaseEnabled()) {
    console.log("Database enabled!");
  } else {
    console.log("Database disabled!");
  }

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});