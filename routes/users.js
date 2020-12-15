var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var config = require('../config');
var conn = mysql.createConnection(config);
conn.query('use gsmcheck');

// 로그인 하기
router.post('/login', function(req, res){
  let data = req.body;
  let e_mail = data.e_mail;
  let pw = data.pw;

  // 데이터베이스에서 이메일 찾기
  conn.query(`SELECT * FROM students where email = ?`, [e_mail], function(err, rows){
    if(err) console.log(err);

    if(!rows){
      res.send('<script type="text/javascript">alert("이메일이 존재하지 않습니다."); window.location="/login"; </script>');
    } else {
      let Dpw = rows[0].pwd;  // 데이터베이스에 있는 비밀번호

      if(pw == Dpw){  // 입력한 비번이랑 같은지
        // 세션 저장
        req.session.e_mail = e_mail;
        req.session.save(function(){
          res.render('main', {e_mail: req.session.e_mail});
       });
      } else {
        res.send('<script type="text/javascript">alert("비밀번호가 다릅니다."); window.location="/login"; </script>');
      }
    }
  });
});

// 회원가입 하기
router.post('/register', function(req, res){
  let data = req.body;
  let num = data.num;
  let email = data.email;
  let psw = data.psw
  let club_id = data.club_id;

  // ㄷㅔ이터베이스에 회원 정보 넣기
  conn.query(`insert into students(email, num, pwd, club_id) values(?, ?, ?, ?)`, [email, num, psw, club_id], function(err, rows){
    if(err) console.log(err);
 
    else {
      res.render('main', {e_mail: req.session.e_mail});
    }
  });
});

// 로그아웃 하기
router.get('/logout',(req, res) => {
  req.session.destroy(function(err){
    // 세션에서 삭제
    res.redirect('/login');
  });
});

router.get('/dbtest',(req, res) => {
  try {
    conn.connect();
    console.log('Database connection success');
  } catch (e){
    console.log(e)
  } 
});

module.exports = router;
