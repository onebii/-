var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var config = require('../config');
var conn = mysql.createConnection(config);

app.use(session({
  secret: process.env.sessiohn_secret_key,
  store: new MySQLStore(config),
  resave: false,
  saveUninitialized: false
}));

router.post('/login', function(req, res){
  let data = req.body;
  let e_mail = data.e_mail;
  let pw = data.pw;

  conn.query(`SELECT * FROM student where = ?`, [e_mail], function(err, rows){
    if(err) console.log(err);

    if(rows.length == 0){
      res.send('아이디가 없습니다');
      res.end();
    }
    
    let Dpw = rows[0].pwd;

    if(pw == Dpw){
      //세션 저장
      req.session.userEmail = email;
      req.session.save(function(){
        res.render('main', {user: req.session.userEmail});
      })
    } else {
      res.send('비밀번호가 다릅니다.');
    }
    
  });
});

router.post('/register', function(req, res){
  let data = req.body;
  let num = data.num;
  let email = data.email;
  let psw = data.psw
  let club_id = data.club_id;

  conn.query(`insert into student(email, num, pwd, club_id) values(?, ?, ?, ?)`, [email, num, psw, club_id], function(err, rows){
    if(err) console.log(err);
 
    else {
      res.render('main');
    }
    
  }); 
});




module.exports = router;
