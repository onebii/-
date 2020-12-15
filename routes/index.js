var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var config = require('../config');
var conn = mysql.createConnection(config);
conn.query('use gsmcheck');

/* GET home page. */
router.get('/main', function(req, res, next) {
  if (!req.session.e_mail) {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다."); window.location="/login"; </script>');
    res.redirect('http://localhost:3000/login');
  }

  conn.query(`SELECT email, num, club_name FROM students where email = ?`, [req.session.e_mail], function(err, rows){
    if(err) console.log(err);

    let result = rows[0];
    let count = 0;

    conn.query(`SELECT count FROM gsmcheck.club_list where club_name = ?`, [result.club_name], (err, rows) => {
      if(err) console.log(err);
      
      if (rows)
        count = rows[0].count;

      let students = {};

      for (var i = 1; i<=3; i++) {
        let grade = i
        conn.query(`SELECT member_id, grade, name FROM gsmcheck.members where club_name = ? and grade = ?;`, [result.club_name, i], (err, rows) => {
          if(err) console.log(err);
          
          students[grade] = {};
          students[grade]['length'] = 0;

          if (rows) {
            students[grade]['length'] = rows.length;

            for(var j = 0; j<rows.length; j++) {
              students[grade][j] = rows[j];
            }
          }
          
          if (grade == 3) {
            // console.log(students);
            res.render('main', {e_mail: result.email, num: result.num, club_name: result.club_name, count: count, students: students});
          }
          });
      }
    });
  });
});

router.get('/', function(req, res) {
  res.redirect('http://localhost:3000/main');
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
