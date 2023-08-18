const express = require('express');
const dbConnection = require('../mysqlConnection');
const router = express.Router();
const flash = require('express-flash');
router.use(flash());


router.get('/home/degrees/:code/hierarchy', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    res.render('./Hierarchy/hiera.ejs', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Hierarchy', department: req.session.department, passedCode: req.session.passedCode })
  }
  else {
    res.redirect('/home');
  }
})

router.get('/home/degrees/:code/hierarchy/add-sub-point', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code}`
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
            res.render('./Hierarchy/addSubPoint', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Add Year', department: req.session.department, passedCode: req.params.code, passedDegree, passedYear , message : req.flash() })
          }
        }
      }
    })
  }
  else {
    res.redirect('/home');
  }

})

router.post('/home/degrees/:code/addSubPoint', (req, res) => {
  console.log(req.body.hide);
  if (req.body.pointCode !== '') {
    const sql0 = `select * from subpointprimary where code = ${req.body.pointCode}`;
    dbConnection.query(sql0, (err, result0) => {
      if (err) console.log(err);
      else if (result0.length > 0) {
        req.flash('error' , 'الكود المدخل مكرر')
        res.redirect(req.get('referer'))
      }
      else {
        const sql = `INSERT INTO subpointprimary (naturalPoint, term, major, code,ardesc, endesc, orderPoint, hideit, slate_code) VALUES  ('${req.body.natural}', '${req.body.level}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.code}')`
        dbConnection.query(sql, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            req.flash('message' , 'تمت العملية بنجاح')
            res.redirect(req.get('referer'))  
          }
        })
      }
    })
  }
  else {
    const sql = `INSERT INTO subpointprimary (naturalPoint, term, major, code,ardesc, endesc, orderPoint, hideit, slate_code) VALUES  ('${req.body.natural}', '${req.body.level}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.code}')`
    dbConnection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        req.flash('message' , 'تمت العملية بنجاح')
        res.redirect(req.get('referer'))  

      }
    })
  }
})
router.get('/home/:code/fetchMainSubPoints', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from subpointprimary where slate_code = ${req.params.code} and hideit = 0 order by orderPoint asc`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        console.log('Done Fetching');
        res.json(result);
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/hierarchy/:subpoint', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from subpointprimary where code = ${req.params.subpoint}`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length == 0) res.status(404).redirect('/404');
        else {
          req.session.passedTeam = result[0].term;
          req.session.passedTeamCode = result[0].code;
          console.log(req.session.passedTeam);
          res.render('./Hierarchy/hieraYear', { name: req.session.username, status: req.session.status, img: req.session.img, title: 'Hierarchy', department: req.session.department, passedCode: req.session.passedCode })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/hierarchy/:teamCode/subpointjsonGet', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql2 = `select term , naturalPoint from subpointprimary where code = '${req.params.teamCode}'`;
    dbConnection.query(sql2, (err, result1) => {
      if (err) console.log(err);
      else {
        const sql = `select * from subpointteam where team_code = '${req.params.teamCode}' and hideit = 0 order by orderPoint asc`;
        dbConnection.query(sql, (err, result2) => {
          if (err) console.log(err);
          else {
            console.log([result1, result2]);
            res.json([result1, result2]);
          }
        })
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/hierarchy/add-sub-point/:teamCode', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode} and hideit != 1`
          dbConnection.query(sql2, (err, result) => {
            if (err) console.log(err);
            else {
              if (result.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                let passedTeam = result[0].term
                res.render('./Hierarchy/addSubTeam', {
                  name: req.session.username,
                  status: req.session.status, img: req.session.img,
                  title: 'Add Term'
                  , department: req.session.department,
                  passedCode: req.params.code,
                  passedTermCode: req.params.teamCode, passedTeam
                  , message : req.flash()
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.post('/home/degrees/:code/hierarchy/:codeTeam/submitSubTeams', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.codeTeam}`
          dbConnection.query(sql2, (err, result) => {
            if (err) console.log(err);
            else {
              if (result.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                if (req.body.pointCode !== '') {
                  const sql3 = `select * from subpointteam where code = ${req.body.pointCode}`
                  console.log(req.body.pointCode);
                  dbConnection.query(sql3, (err, result) => {
                    console.log(result);
                    if (err) console.log(err);
                    else if (result.length > 0) {
                      req.flash('error' , 'الكود المدخل مكرر')
                      res.redirect(req.get('referer'))
                    }
                    else {
                      const sql4 = `INSERT INTO subpointteam (naturalPoint, term, major, code,ardesc, endesc, orderPoint, hideit, team_code) VALUES  ('${req.body.natural}', '${req.body.level}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.codeTeam}')`
                      dbConnection.query(sql4, (err, result) => {
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
                  const sql4 = `INSERT INTO subpointteam (naturalPoint, term, major, code,ardesc, endesc, orderPoint, hideit, team_code) VALUES  ('${req.body.natural}', '${req.body.level}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.codeTeam}')`
                  dbConnection.query(sql4, (err, result) => {
                    if (err) console.log(err);
                    else {
                      req.flash('message' , 'تمت العملية بنجاح')
                      res.redirect(req.get('referer'))  
          
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result3) => {
                  if (result3.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    let degree = `${result2[0].major}`;
                    let team = `${result2[0].term}`
                    let term = `${result3[0].term}`
                    res.render('./Hierarchy/term', {
                      name: req.session.username,
                      status: req.session.status,
                      img: req.session.img, title: 'Term',
                      department: req.session.department,
                      degree, team, term
                    })

                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/sections', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result3) => {
                  if (result3.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    let degree = `${result2[0].major}`;
                    let team = `${result2[0].term}`
                    let term = `${result3[0].term}`
                    res.render('./Hierarchy/sections', {
                      name: req.session.username,
                      status: req.session.status,
                      img: req.session.img, title: 'Sections',
                      department: req.session.department,
                      degree, team, term
                    })

                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/exams', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result3) => {
                  if (result3.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    let degree = `${result2[0].major}`;
                    let team = `${result2[0].term}`
                    let term = `${result3[0].term}`
                    res.render('./Hierarchy/exams', {
                      name: req.session.username,
                      status: req.session.status, img: req.session.img,
                      title: 'Exams', department: req.session.department,
                      degree, team, term
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/exams/add', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode} and hideit != 1`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode} and hideit != 1`
                dbConnection.query(sql3, (err, result3) => {
                  if (err) console.log(err);
                  else if (result3.length === 0) res.status(404).redirect('/404');
                  else {
                    let passedTeam = result3[0].major
                    let passedTerm = result3[0].term
                    res.render('./Hierarchy/addExams', {
                      name: req.session.username,
                      status: req.session.status, img: req.session.img,
                      title: 'Add Exam'
                      , department: req.session.department,
                      passedCode: req.params.code,
                      passedTermCode: req.params.teamCode, passedTeam, passedTerm
                      , message : req.flash()
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.post('/home/degrees/:code/hierarchy/:teamCode/:termCode/addExam', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result) => {
            if (err) console.log(err);
            else {
              if (result.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.teamCode}`
                dbConnection.query(sql3, (err, result) => {
                  console.log(result);
                  if (err) console.log(err);
                  else if (result.length > 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    if (req.body.pointCode !== '') {
                      const sql9 = `select * from exams where code = ${req.body.pointCode}`;
                      dbConnection.query(sql9, (err, result5) => {
                        if (err) console.log(err);
                        else if (result5.length > 0) {
                          req.flash('error' , 'الكود المدخل مكرر')
                          res.redirect(req.get('referer'))
                        }
                        else {
                          const sql4 = `INSERT INTO exams (naturalPoint , major, code ,ardesc, endesc, orderPoint, hideit, term_code) VALUES  ('${req.body.natural1}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.termCode}')`
                          dbConnection.query(sql4, (err, result) => {
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
                      const sql4 = `INSERT INTO exams (naturalPoint , major, code ,ardesc, endesc, orderPoint, hideit, term_code) VALUES  ('${req.body.natural1}', '${req.body.main}', '${req.body.pointCode}', '${req.body.subPointArDesc}', '${req.body.subPointEnDesc}', '${req.body.order}', '${req.body.hide}', '${req.params.termCode}')`
                      dbConnection.query(sql4, (err, result) => {
                        if (err) console.log(err);
                        else {
                          req.flash('message' , 'تمت العملية بنجاح')
                          res.redirect(req.get('referer'))  
              
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/exams/show', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result3) => {
                  if (result3.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    let exams
                    const sql4 = `select * from exams where term_code = ${req.params.termCode} and hideit = 0 order by orderPoint asc`
                    dbConnection.query(sql4, (err, result4) => {
                      if (err) console.log(err);
                      else if (result4 === 0) exams = 'لا يوجد دور امتحان مدخلة'
                      else {
                        exams = result4;
                        let degree = `${result2[0].major}`;
                        let team = `${result2[0].term}`
                        let term = `${result3[0].term}`
                        res.render('./Hierarchy/showExam', {
                          name: req.session.username,
                          status: req.session.status, img: req.session.img,
                          title: 'Exams', department: req.session.department,
                          degree, team, term, exams
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/sections/show', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result3) => {
                  if (result3.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    let exams
                    const sql4 = `select * from sections where term_code = ${req.params.termCode}`
                    dbConnection.query(sql4, (err, result4) => {
                      if (err) console.log(err);
                      else if (result4 === 0) exams = 'لا يوجد دور امتحان مدخلة'
                      else {
                        exams = result4;
                        let degree = `${result2[0].major}`;
                        let team = `${result2[0].term}`
                        let term = `${result3[0].term}`
                        res.render('./Hierarchy/showSections', {
                          name: req.session.username,
                          status: req.session.status, img: req.session.img,
                          title: 'Sections', department: req.session.department,
                          degree, team, term, exams
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/degrees/:code/hierarchy/:teamCode/:termCode/sections/add', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result1) => {
      if (err) console.log(err);
      else {
        if (result1.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode} and hideit != 1`
          dbConnection.query(sql2, (err, result2) => {
            if (err) console.log(err);
            else {
              if (result2.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode} and hideit != 1`
                dbConnection.query(sql3, (err, result3) => {
                  if (err) console.log(err);
                  else if (result3.length === 0) res.status(404).redirect('/404');
                  else {
                    let passedTeam = result3[0].major
                    let passedTerm = result3[0].term
                    res.render('./Hierarchy/addSection', {
                      name: req.session.username,
                      status: req.session.status, img: req.session.img,
                      title: 'Add Sections'
                      , department: req.session.department,
                      passedCode: req.params.code,
                      passedTermCode: req.params.teamCode, passedTeam, passedTerm
                      , message : req.flash()
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.post('/home/degrees/:code/hierarchy/:teamCode/:termCode/addSection', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from slate where code = ${req.params.code} and degree != ''`
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else {
        if (result.length === 0) {
          console.log('no slate');
          res.status(404).redirect('/404')
        }
        else {
          const sql2 = `select * from subpointprimary where code = ${req.params.teamCode}`
          dbConnection.query(sql2, (err, result1) => {
            if (err) console.log(err);
            else {
              if (result1.length === 0) {
                console.log('no team');
                res.status(404).redirect('/404')
              }
              else {
                const sql3 = `select * from subpointteam where code = ${req.params.termCode}`
                dbConnection.query(sql3, (err, result2) => {
                  console.log(result2);
                  if (err) console.log(err);
                  else if (result2.length === 0) {
                    res.status(404).redirect('/404')
                  }
                  else {
                    if (req.body.sectionBranchCode !== '') {
                      const sql9 = `select * from sections where section_code = ${req.body.sectionBranchCode}`;
                      dbConnection.query(sql9, (err, result5) => {
                        if (err) console.log(err);
                        else if (result5.length > 0) {
                          req.flash('error' , 'الكود المدخل مكرر')
                          res.redirect(req.get('referer'))                  
                        }
                        else {
                          const sql4 = `INSERT INTO sections (section_name , section_code , term_code) VALUES  ('${req.body.sectionBranchDesc}', '${req.body.sectionBranchCode}', '${req.params.termCode}')`
                          dbConnection.query(sql4, (err, result) => {
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
                      const sql4 = `INSERT INTO sections (section_name , section_code , term_code) VALUES  ('${req.body.sectionBranchDesc}', '${req.body.sectionBranchCode}', '${req.params.termCode}')`
                      dbConnection.query(sql4, (err, result) => {
                        if (err) console.log(err);
                        else {
                          req.flash('message' , 'تمت العملية بنجاح')
                          res.redirect(req.get('referer'))  
              
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.get('/home/section/:sectionCode', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from sections where section_code = ${req.params.sectionCode}`;
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else if (result === 0) res.status(404).redirect('/404');
      else {
        let section = result[0]['section_name'];
        const sql2 = `select * from branches where section_code = ${req.params.sectionCode}`;
        dbConnection.query(sql2, (err, result2) => {
          if (err) console.log(err);
          else {
            let branches = result2;
            res.render('./Hierarchy/showBranches', {
              name: req.session.username,
              status: req.session.status, img: req.session.img,
              title: 'Show Branches'
              , department: req.session.department,
              section, branches
            })

          }
        })
      }
    })
  }
  else {
    res.redirect('/home')
  }
})
router.get('/home/section/:sectionCode/addNewBranch', (req, res) => {
  if (req.session.loggedin && req.session.status == 2) {
    const sql = `select * from sections where section_code = ${req.params.sectionCode}`;
    dbConnection.query(sql, (err, result) => {
      if (err) console.log(err);
      else if (result === 0) res.status(404).redirect('/404');
      else {
        let sectionCode = req.params.sectionCode;
        let section = result[0]['section_name'];
        res.render('./Hierarchy/addBranch', {
          name: req.session.username,
          status: req.session.status, img: req.session.img,
          title: 'Add New Branches'
          , department: req.session.department,
          section, sectionCode
          , message : req.flash()
        })

      }
    })
  }
  else {
    res.redirect('/home')
  }
})

router.post('/home/section/:sectionCode/submitBranch', (req, res) => {
  const sql = `select * from sections where section_code = ${req.params.sectionCode}`
  dbConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    else if (result === 0) res.status(404).redirect('/404');
    else {
      if (req.body.sectionBranchCode !== '') {
        const sql2 = `select * from branches where branch_code = ${req.body.sectionBranchCode}`;
        dbConnection.query(sql2, (err, result2) => {
          if (err) console.log(err);
          else if (result2.length > 0) {
            {
              req.flash('error' , 'الكود المدخل مكرر')
              res.redirect(req.get('referer'))
            }
          }
          else {
            const sql3 = `INSERT INTO branches (branch_name, branch_code, section_code ) VALUES ('${req.body.sectionBranchDesc}', '${req.body.sectionBranchCode}', '${req.params.sectionCode}')`;
            dbConnection.query(sql3, (err, result3) => {
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
        const sql3 = `INSERT INTO branches (branch_name, branch_code, section_code ) VALUES ('${req.body.sectionBranchDesc}', '${req.body.sectionBranchCode}', '${req.params.sectionCode}')`;
        dbConnection.query(sql3, (err, result3) => {
          if (err) console.log(err);
          else {
            req.flash('message' , 'تمت العملية بنجاح')
            res.redirect(req.get('referer'))  

          }
        })
      }
    }
  })
})

module.exports = router;