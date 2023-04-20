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
const {database, dbConnect, databaseEnabled} = require('./utility/db');
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
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

// Comment this in when you want to use a database
//dbConnect();
if (!databaseEnabled) {
  console.log('Database not enabled!');
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});