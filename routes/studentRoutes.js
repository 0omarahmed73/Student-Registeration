const express = require('express');
const dbConnection = require('../mysqlConnection');
const router = express.Router();


router.get('/home/students', (req, res) => {
  if (req.session.loggedin && req.session.status == 1) {
    res.render('./studentsPages/students', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Students List', department: req.session.department });
  }
  else if (req.session.loggedin && req.session.status == 2) {
    res.render('./studentsPages/students2', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Students List', department: req.session.department });
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/students/:id', (req, res) => {
  if (req.session.loggedin && req.session.status == 1) {
    req.session.passID = req.params.id;
    res.render('./studentsPages/students', { title: `${req.session.passID}`, name: req.session.username, status: req.session.status, img: req.session.img, department: req.session.department });
  }
  else if (req.session.loggedin && req.session.status == 2) {
    req.session.passID = req.params.id;
    res.render('./studentsPages/students2', { title: `${req.session.passID}`, name: req.session.username, status: req.session.status, img: req.session.img, department: req.session.department });
  }
  else {
    res.redirect('/home');
  }
})

router.get('/home/students.getID/:id', (req, res) => {
  if (req.session.loggedin && req.session.status != 0 && req.session.passID) {
    res.json(req.session.passID);
  }
  else {
    res.redirect('/home');
  }
})



module.exports = router;