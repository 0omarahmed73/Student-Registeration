const express = require('express');
const mysql = require('mysql');
const app = express();

const dbConnection = mysql.createConnection({
  host : 'bs323llucaszxkvbo2l8-mysql.services.clever-cloud.com',
  user : 'u5ey4qjtoigvelan',
  password : 'Mrr3e3gJ7APkbHYYVQkb',
  database : 'bs323llucaszxkvbo2l8',
  port : 3306
});

dbConnection.connect(err => err ? console.log(err) : console.log(`Database Connected`));

module.exports = dbConnection
