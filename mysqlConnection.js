const express = require('express');
const mysql = require('mysql');
const app = express();

const dbConnection = mysql.createConnection({
  host : 'localhost',
  user : 'omar12',
  password : 'Oo123456',
  database : 'studentregisteration',
  port : 3306
});

dbConnection.connect(err => err ? console.log(err) : console.log(`Database Connected`));

module.exports = dbConnection