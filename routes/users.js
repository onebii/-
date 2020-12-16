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
router.post('/login', function (req, res) {
  let data = req.body;
  let e_mail = data.e_mail;
  let pw = data.pw;
  let num = data.num;

  // 데이터베이스에 이메일 있는지 확인
  conn.query(`SELECT * FROM students where email = ?`, [e_mail], function (err, rows) {
    if (err) console.log(err);

    if (rows.length == 0) {
      res.send('<script type="text/javascript">alert("이메일 다름"); window.location="/login"; </script>');
      res.end();
    } else {
      let num = rows[0].num;
      let club_id = rows[0].club_id;
      let Dpw = rows[0].pwd;  // 데이터베이스에 있는 비밀번호
      let club_name = "";
      let students = [];



      if (pw == Dpw) {  // 입력한 비번이랑 같은지
        // 같으면 세션 저장
        req.session.e_mail = e_mail;
        req.session.save(function () {
          conn.query(`select title from club where club_id="${club_id}";`, function (err, row) {
            club_name = row[0].title;
            // console.log(club_name);
            conn.query(`SELECT num FROM gsmcheck.students where club_id="${club_id}";`, function (err, rows) {
              for (i = 0; i < rows.length; i++) {
                students[i] = rows[i].num;
                // console.log(students[i]);
              }
              console.log(students);
              res.render('main', { e_mail: req.session.e_mail, num: num, club_name: club_name, students: students});
            });
          });
        });
      } else {
        res.send('<script type="text/javascript">alert("비밀번호가 다릅니다."); window.location="/login"; </script>');
      }
    }
  });
});

// 회원가입 하기
router.post('/register', function (req, res) {
  let data = req.body;
  let num = data.num;
  let email = data.email;
  let psw = data.psw
  let club_id = data.club_id;

  conn.query(`insert into students(email, num, pwd, club_id) values(?, ?, ?, ?)`, [email, num, psw, club_id], function (err, rows) {
    if (err) console.log(err);

    else {
      res.render('main', { e_mail: req.session.e_mail, num: num, club_name: "", students: "" });
    }
  });
});

// router.post('/main', function(req, res){
//   let data = req.body;
//   let num = data.num;
//   let email = data.email;
//   let name = data.name;

//   conn.query((`SELECT * FROM students`, function(err, rows){

//   });
// });

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
});


router.get('/dbtest', (req, res) => {
  try {
    conn.connect();
    console.log('Database connection success');
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;
