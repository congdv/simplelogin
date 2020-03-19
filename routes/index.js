const express = require('express');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

router.get('/', (_req, res) => {
  return res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  return res.render('dashboard', {
    name: req.user.name
  });
});

module.exports = router;