var express = require('express')
var router = express.Router()

const { doPayment, success } = require('../controller/paypal')
/** Post Ether */
router.post('/create-payment', (req, res) => doPayment(req, res))
router.get('/excute-payment', (req, res) => success(req, res))

module.exports = router
