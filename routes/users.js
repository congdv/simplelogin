const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

//Login
router.get('/login', (_req, res) => {
  return res.render('login');
});

//Register
router.get('/register', (_req, res) => {
  return res.render('register');
});

//Register Handle
router.post('/register', async(req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //check required fields
  if(!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if(password != password2) {
    errors.push({ msg: 'Passwords do not match '});
  }

  //Check pass length
  if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    try {
      const user = await User.findOne({ email: email});
      if(user) {
        errors.push({msg: 'Email is already registerd '});
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        //Hash Password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, async(err, hash) => {
          if(err) throw err;

          //Set hashPassword
          newUser.password = hash;
          const savedUser =await newUser.save();
          if(savedUser) {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        }));
      }
    } catch(error) {
      errors.push({msg: error });
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    }
  }

});


//Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res, next);
});

//Log out handle
router.get('/logout',(req,res) => {
  req.logOut();
  req.flash('success_msg','You are logged out');
  res.redirect('/users/login');
});
module.exports = router;