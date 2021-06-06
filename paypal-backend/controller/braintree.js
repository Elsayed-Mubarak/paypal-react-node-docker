const request = require('request')
const catchErrors = require('../middleware/catchErrors')
var braintree = require('braintree')
/**
 *
 * Payment Braintree Controller
 *
 */
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: '2zb4kmc98rqzfhqy',
  publicKey: 'fkrqd8bsrhny7274',
  privateKey: '4e8edc46ccfea04f40d7f225eb5cfcaf',
})

const createPayment = async (req, res) => {
  catchErrors(
    gateway.transaction.sale(
      {
        amount: '5.00',
        paymentMethodNonce: 'nonce-from-the-client',
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (err) {
          console.error(err)
          return
        }

        if (result.success) {
          console.log('Transaction: ' + result.transaction)

          console.log('Transaction ID: ' + result.transaction.id)
        } else {
          console.error(result.message)
        }
      },
    ),
  )
}
module.exports = { createPayment }
