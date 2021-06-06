var express = require('express')
var router = express.Router()

const { doPayment, success, cancel } = require('../controller/paypal')
const { doPaymentWithPayoneer } = require('../controller/payoneer')
/** Post Ether */
router.post('/pay', (req, res) => doPayment(req, res))
router.post('/pay/payoneer', (req, res) => doPaymentWithPayoneer(req, res))
router.get('/success', (req, res) => success(req, res))
router.get('/cancel', (req, res) => cancel(req, res))

module.exports = router
