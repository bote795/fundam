var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/game', function(req, res, next) {
/*  if (!req.isAuthenticated())
  {
  	return res.redirect('/');	
  }*/
  //res.render('game', { username : req.user.username });
  res.render('game', { username : "erick" });
});

module.exports = router;
