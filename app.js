const express = require('express');
const cors = require('cors');
const dbConnection = require('./mysqlConnection');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const flash = require('express-flash');
const hierarchyRouter = require('./routes/hierarchyRoutes.js');
const slateRouter = require('./routes/slateRoutes.js');
const studentRouter = require('./routes/studentRoutes.js')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(hierarchyRouter);
app.use(slateRouter);
app.use(studentRouter);
app.use(flash());
app.get('/', (req, res) => {
  res.redirect('/login');
})

app.get('/login', (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/home')
  }
  else {
    res.cookie('found', '')
    res.render('login', { notfound: req.cookies['found'] })
  }
})

app.post('/home', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const sql = `SELECT id , department , name , type , img FROM students WHERE id = ${id} AND password = '${password}'
  UNION ALL
  SELECT id , department , name , type , img FROM instructors WHERE id = ${id} AND password = '${password}'
  UNION ALL
  SELECT id , department , name , type , img FROM admin WHERE id = ${id} AND password = '${password}'
  `
  dbConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    else if (result.length > 0) {
      let name2 = result[0].name;
      let status2 = result[0].type;
      let img = result[0].img;
      let department = result[0].department;
      req.session.loggedin = true;
      req.session.username = name2;
      req.session.status = status2;
      req.session.department = department;
      req.session.img = img;
      res.redirect('/home');
    }
    else {
      res.cookie('found', 'هذا المستخدم غير موجود')
      res.redirect('/login')
    }
  })
})

app.get('/home', (req, res) => {
  if (req.session.loggedin) {
    if (req.session.status == 1) {
      res.render('homePages/home', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Instructor', department: req.session.department })
      req.session.passID = '';

    }
    else if (req.session.status == 0) {
      res.render('homePages/home2', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Student', department: req.session.department })
    }
    else if (req.session.status == 2) {
      res.render('homePages/home3', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Admin', department: req.session.department })
    }
  }
  else {
    res.redirect('/login')
  }
})

app.get('/home.json', (req, res) => {
  if (req.session.loggedin && req.session.status == 1) {
    const sql = 'Select * from students where instructor = ?'
    dbConnection.query(sql, [req.session.username], (err, result) => {
      if (err) console.log(err);
      else {
        // console.log(result);
        res.json(result)
      }
    })
  }
})
app.get('/home3.json', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `Select * from students where department = '${req.session.department}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        res.json(result)
      }
    })
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ redirect: '/login' });

})

app.get('/home/done', (req, res) => {
  if (req.session.loggedin && (req.session.status == 2 || req.session.status == 1)) {
    res.render('done', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Done', department: req.session.department })
  }
  else {
    res.redirect('/home')
  }
})


app.use((req, res) => {

  res.status(404).render('404', { title: '404 - Not Found', 
  img: req.session.img ? req.session.img : '', 
  status: req.session.status ? req.session.status : '', 
  name: req.session.username ? req.session.username : '', 
  department: req.session.department ? req.session.department : '' })
})
app.listen(3000);

