const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const paypalConfig = require('../config/env/paypal.config.json')
const PaymentDetails = require('../model/PaymentDetails')
const catchErrors = require('../middleware/catchErrors')
/**
 *
 * Payment Controller contain 2 func (create , excute)
 *
 */
const createPayment = catchErrors(async (req, res) => {
  const { money } = req.body
  var usdMoney = Number.parseFloat(money).toFixed(2)
  const create_payment_json = {
    auth: {
      user: paypalConfig.client_id,
      pass: paypalConfig.client_secret,
    },
    body: {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: '5.99',
            currency: 'USD',
          },
          description: 'isec paypal Payment',
        },
      ],
      redirect_urls: {
        return_url: 'http://localhost:5000/api/success',
        cancel_url: 'http://localhost:5000/api/cancel',
      },
    },
    json: true,
  }

  request.post(
    paypalConfig.PAYPAL_API + '/v1/payments/payment',
    create_payment_json,
    function (err, response) {
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id,
        usdMoney,
      })
    },
  )
})
/**
 *@desc Excute Payment Service
 *@returns
 *
 */
const excutePayment = catchErrors(async (req, res) => {
  // 2. Get the payment ID and the payer ID from the request body.
  var paymentID = req.body.paymentID
  var payerID = req.body.payerID
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(
    paypalConfig.PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute',
    {
      auth: {
        user: paypalConfig.client_id,
        pass: paypalConfig.client_secret,
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: '60859.34',
              currency: 'USD',
            },
          },
        ],
      },
      json: true,
    },
    function (err, response) {
      console.log('... ...  excute response ... ...', JSON.stringify(response))
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      const paymentDetails = new PaymentDetails()
      paymentDetails.paymentMethod = 'PAYPAL'
      paymentDetails.paymentProviderName = 'PayPal'
      let paymentAmount = response.body.transactions.find(
        (itm) => itm.amount.total,
      )
      console.log(' paymentAmount  num.......... ', paymentAmount.amount.total)
      paymentDetails.paymentAmount = parseInt(
        paymentAmount.amount.total,
      ).toFixed(2)
      paymentDetails.paymentDate = Date.now()
      paymentDetails.transactionCode = response.body.id
      paymentDetails.transactionDetails.push(
        response.body.transactions.find((itm) => itm.amount.details),
      )
      paymentDetails.paymentId = paymentID
      paymentDetails.payerId = payerID
      paymentDetails.paymentStatus = 'Approved'
      paymentDetails.feesAmount = parseInt(
        response.body.transactions[0].related_resources[0].sale.transaction_fee
          .value,
      ).toFixed(2)
      paymentDetails.save().then((paymentDetails) => {
        if (err) {
          console.log(' err', err)
          return err
        } else {
          console.log(' paymentDetails', paymentDetails)
          return paymentDetails
        }
      })
      // 4. Return a success response to the client
      res.json({
        status: 'success',
      })
    },
  )
})
module.exports = { createPayment, excutePayment }
