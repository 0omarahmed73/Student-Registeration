const express = require('express');
const mysql = require('mysql');
const app = express();

const dbConnection = mysql.createConnection({
  host : 'sql209.liveblog365.com',
  user : 'lblog_34866162',
  password : 'Oo123456',
  database : 'lblog_34866162_studentReg',
  port : 3306
});

dbConnection.connect(err => err ? console.log(err) : console.log(`Database Connected`));

module.exports = dbConnection
