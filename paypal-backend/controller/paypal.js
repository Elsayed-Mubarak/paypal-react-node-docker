const paypal = require('paypal-rest-sdk')
const paypalConfig = require('../config/env/paypal.config.json')
const PaymentDetails = require('../model/PaymentDetails')

paypal.configure(paypalConfig)

var tempMony = {}
const doPayment = async (req, res) => {
  const { money } = req.body
  console.log(' money ............', money)

  var usdMoney = Number.parseFloat(money).toFixed(2)
  tempMony.total = usdMoney
  console.log(' fixed.....', tempMony.total)

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:5000/api/success',
      cancel_url: 'http://localhost:5000/api/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Fees For Document Transaction',
              sku: '001',
              price: usdMoney,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: usdMoney,
        },
        description: 'Send Document Transaction Paypal Decutting',
      },
    ],
  }
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href)
        }
      }
    }
  })
}

const success = (req, res) => {
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId
  console.log(' query ..............query.......', req.query)
  console.log(' temp mony ..............total.......', tempMony.total)

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: tempMony.total,
        },
      },
    ],
  }

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment,
  ) {
    console.log(' sayed .....paymentId', paymentId)
    console.log(' sayed .....execute_payment_json', execute_payment_json)
    //console.log(' sayed .....JSON.stringify(payment)', JSON.stringify(payment))

    if (error) {
      console.log(error.response)
      throw error
    } else {
      console.log(JSON.stringify(payment))
      res.send('Success')
    }
  })
}

const cancel = (req, res) => res.send('Cancelled')

module.exports = { doPayment, success, cancel }
