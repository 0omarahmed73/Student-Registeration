const express = require('express');
const dbConnection = require('../mysqlConnection');
const router = express.Router();
const flash = require('express-flash');
router.use(flash());

router.get('/home/add-new-slate', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    res.render('./slatePages/addSlate', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'New Slate', department: req.session.department , message : req.flash() })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/edit-slates', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    res.render('./slatePages/editSlate', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'View Slate', department: req.session.department , message : req.flash() })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code', (req, res) => {
  req.session.passedCode = req.params.code;
  if (req.session.loggedin && req.session.status == 2) {
    res.render('./slatePages/degrees', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'New Slate', department: req.session.department, passedCode: req.session.passedCode })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees.getCode/:code', (req, res) => {
  res.json(req.session.passedCode);
})

router.post('/home/degrees/:code/save', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `UPDATE slate SET degree = '${req.body.degree}' WHERE code = '${req.params.code}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
    })
    res.redirect(`/home/degrees/${req.params.code}`)
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/save', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    res.redirect(`/home/degrees/${req.params.code}`)
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/save.updateSlates', (req, res) => {
  const sql = `Select degree from slate where code = '${req.params.code}' `
  dbConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    else {
      res.json(result)
    }
  })
})
router.get('/home/degrees/:code/removeDegree', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `UPDATE slate SET degree = '' WHERE code = '${req.params.code}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
    })
    res.redirect(`/home/degrees/${req.params.code}`);
  }
  else {
    res.redirect('/home')
  }
});

router.get('/home/degrees/:code/showCertificates', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select degree , year from slate where code = '${req.params.code}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          res.status(404).render('404', { title: '404 - Not Found', img: req.session.img ? req.session.img : '', status: req.session.status ? req.session.status : '', name: req.session.username ? req.session.username : '', department: req.session.department ? req.session.department : '' })
        }
        else {
          req.session.passIt = req.params.code;
          console.log(req.params.code);
          let passedDegree = result[0]['degree'];
          let passedYear = result[0]['year']
          if (passedDegree !== '') {
            res.render('./slatePages/showCertificates', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Show Certificates', department: req.session.department, passedCode: req.params.code, passedDegree, passedYear })
          }
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:id/showIt', (req, res) => {
  console.log(req.params.id);
  req.params.id = req.session.passIt;
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from certificate where slate_code ='${req.params.id}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else res.json(result)
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/givenCertificates', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select degree , year from slate where code = '${req.params.code}' `
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          res.status(404).render('404', { title: '404 - Not Found', img: req.session.img ? req.session.img : '', status: req.session.status ? req.session.status : '', name: req.session.username ? req.session.username : '', department: req.session.department ? req.session.department : '' })
        }
        else {
          let passedDegree = result[0]['degree'];
          let passedYear = result[0]['year']
          if (passedDegree !== '') {
            res.render('./slatePages/givenCertificates', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Add Certificates', department: req.session.department, passedCode: req.params.code, passedDegree, passedYear , message : req.flash() })
          }
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.post('/home/degrees/:code/addDegree', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql2 = `select certificate_code from certificate where certificate_code = '${req.body.certificateCode}'`;
    dbConnection.query(sql2, (err, result) => {
      if (err) console.log(err);
      else if (result.length >= 1) {
        req.flash('error' , 'الكود المدخل مكرر')
        res.redirect(req.get('referer'))
      }
      const sql = `INSERT INTO certificate (slate_code, divSection, certificate_code, ar_desc, en_desc, trainningYear ) VALUES ('${req.body['slate_code']}', '${req.body.department}', '${req.body.certificateCode}', '${req.body['ar-desc2']}', '${req.body['en-desc2']}', '${req.body.trainningYear}')`;
      dbConnection.query(sql, (err, result) => {
        if (err) console.log(err);
        else {
          req.flash('message' , 'تمت العملية بنجاح')
          res.redirect(req.get('referer'))
        }
      })
    })
  }
  else {
    res.redirect('/home')

  }
})
router.get('/home/degrees/:code/addDegree', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    res.redirect(`/home/degrees/${req.params.code}/givenCertificates`)
  }
  else {
    res.redirect('/home')
  }
})

router.post('/home/addNewSlate', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    if (req.body.slatecode !== ''){
    const sql2 = 'select code from slate where code =' + req.body.slatecode;
    dbConnection.query(sql2 , (err , result) => {
      console.log(result);
      if (err) console.log(err);
      else if (result.length > 0) {
        req.flash('error' , 'الكود المدخل مكرر')
        res.redirect(req.get('referer'))
      }
      else {
        const sql = `INSERT INTO slate (slate_name, department, degree, en_description, ar_description, code, year, government_num, government_date, notes, current, next_students, gender, teaching_type) VALUES ('${req.body.nameSlate}', '${req.session.department}', '', '${req.body.endesc}', '${req.body.ardesc}', '${req.body.slatecode}', '${req.body.year}', '${req.body.governcode}', '${req.body.date}', '${req.body.notes}', '${req.body.currentSlate}', '${req.body.nextStds}', '${req.body.type}', '${req.body.study}')`
        dbConnection.query(sql, (err, result) => {
          if (err) console.log(err);
          else {
            req.flash('message' , 'تمت العملية بنجاح')
            res.redirect(req.get('referer'))  
          }
        })
      }
    })
  }
  else {
    const sql = `INSERT INTO slate (slate_name, department, degree, en_description, ar_description, code, year, government_num, government_date, notes, current, next_students, gender, teaching_type) VALUES ('${req.body.nameSlate}', '${req.session.department}', '', '${req.body.endesc}', '${req.body.ardesc}', '${req.body.slatecode}', '${req.body.year}', '${req.body.governcode}', '${req.body.date}', '${req.body.notes}', '${req.body.currentSlate}', '${req.body.nextStds}', '${req.body.type}', '${req.body.study}')`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        req.flash('message' , 'تمت العملية بنجاح')
        res.redirect(req.get('referer'))  
  }
    })
  }
  }
  else {
    res.redirect('/404');
  }
})

router.get('/slates.json', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `Select * from slate where department = '${req.session.department}' order by slate_name desc`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        res.json(result)
      }
    })
  }
})

router.get('/home/degrees', (req, res) => {
  res.redirect('/home/edit-slates')
})



module.exports = router