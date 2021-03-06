'use strict';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { } from './models'
import Promise from 'bluebird'

// Configure
Promise.config({
  longStackTraces: true,
  warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
})

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");  
  next();
});

app.use('/api/product', require('./controllers/product'));
app.use('/api/customer', require('./controllers/customer'));
app.use('/api/invoice', require('./controllers/invoice'));
app.use('/api/report', require('./controllers/report'));
app.use('/api/bulk-data', require('./controllers/bulkData'));
app.use('/api/user', require('./controllers/user'));
app.use('/api/auth', require('./controllers/auth'));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});
