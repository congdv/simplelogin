const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Load User Model

const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      // Match user
      try {
        const user = await User.findOne({ email: email });
        if(!user) {
          return done(null, false, { message: 'That email is not registerd '});
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;

          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false), {message: 'Password incorect'};
          }
        });
      } catch(error) {
        console.log(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};