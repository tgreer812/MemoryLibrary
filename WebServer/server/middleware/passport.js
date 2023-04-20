const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {database} = require('../utility/db');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true
  },

  async function(username, password, done) {
    await database.getUserByName(username, (err, user) => {
      if (err) {
        console.log("Error authenticating user!");
        return done(err);
      }
      if (!user) {
        console.log("No user found!");
        return done(null, false);
      }
      if (user.password !== password) {
        console.log("User failed to authenticate!");
        return done(null, false);
      }
      console.log("User authenticated!");
      return done(null, user);
    });
  }
));

// Serialize user for storing in session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// Deserialize user from session
passport.deserializeUser((username, done) => {
    database.getUserByName(username, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
  });

module.exports = passport;
