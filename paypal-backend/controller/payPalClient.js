const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const paypalConfig = require('../config/env/paypal.config.json')
const PaymentDetails = require('../model/PaymentDetails')

const createPayment = async (req, res) => {
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
      console.log('... response ...on create...', response)
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id,
      })
    },
  )
}

const excutePayment = async (req, res) => {
  // 2. Get the payment ID and the payer ID from the request body.
  console.log(req.body)
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
              total: '10.99',
              currency: 'USD',
            },
          },
        ],
      },
      json: true,
    },
    function (err, response) {
      console.log('... excute response ...', JSON.stringify(response))
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      const paymentDetails = new PaymentDetails()
      paymentDetails.paymentMethod = 'PAYPAL'
      paymentDetails.paymentProviderName = 'PayPal'
      paymentDetails.paymentAmount = response.body.transactions.find(
        (itm) => itm.amount.total,
      )
      paymentDetails.transactionCode = response.body.transactions.find((itm) =>
        itm.related_resources.map((tID) => tID.sale.id),
      )
      paymentDetails.paymentId = paymentID
      paymentDetails.payerId = payerID
      paymentDetails.paymentStatus = 'Approved'
      paymentDetails.paymentStatusHistory.push({
        fromStatus: 'Created',
        toStatus: 'Approved',
        changeAt: Date.now(),
      })
      paymentDetails.feesAmount = response.body.transactions.find((itm) =>
        itm.related_resources.map((tID) => tID.sale.transaction_fee.value),
      )
      paymentDetails.save((err, paymentDetails) => {
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
}

module.exports = { createPayment, excutePayment }
