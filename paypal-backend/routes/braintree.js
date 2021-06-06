var express = require('express')
var router = express.Router()

const createPayment = require('../controller/braintree')
/** Post Ether */
router.post('/pay', (req, res) => createPayment(req, res))
router.get('/success', (req, res) => success(req, res))
router.get('/cancel', (req, res) => cancel(req, res))

module.exports = router
