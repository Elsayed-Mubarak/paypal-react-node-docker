var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const ejs = require('ejs')
var cors = require('cors')
const mongoose = require('./config/config')
var app = express()

var payment = require('./routes/paypal')
var paypalNewVersion = require('./routes/paypalNewVersion')
const paymentLastVersion = require('./routes/paypalNewVersion')
const paymentClient = require('./routes/paypalClient')
const braintreePayment = require('./routes/braintree')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
//app.set('view engine', 'jade')
app.set('view engine', 'ejs')
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/braintree', (req, res) => res.render('braintree'))
app.get('/api', (req, res) => res.render('index'))
app.get('/api/v2', (req, res) => res.render('paypalv2'))
app.get('/api/stripe', (req, res) => res.render('stripe'))
app.use('/api', payment)
app.use('/api/v1', paypalNewVersion)
app.use('/api/v3/payments', paymentLastVersion)
app.use('/api/v4/payments', paymentClient)
app.use('/api/v5/braintree', braintreePayment)
module.exports = app
