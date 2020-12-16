var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('main', {e_mail: req.session.e_mail, num: "", club_name: "", students: []});
});

router.get('/list', function(req, res){
  res.render('list');
});

router.get('/login', function(req, res){
  res.render('login');
});

router.get('/register', function(req, res){
  res.render('register');
});

module.exports = router;
