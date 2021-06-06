var express = require('express')
var router = express.Router()
let corsDoor = require('../middleware/cors')
var cors = require('cors')
var corsOptions = require('../middleware/cors')
let app = require('../app')
const {
  createPayment,
  excutePayment,
} = require('../controller/paypalNewVersion')



/** Post Ether */
router.post('/create-payment', cors(corsOptions), (req, res) =>
  createPayment(req, res),
)
router.post('/execute-payment', (req, res) => excutePayment(req, res))

module.exports = router
