import React, { useEffect } from 'react'
import CardTemplate from '../components/Card'
import CoinsDashboard from './CoinsDashboard'
export default function PaypalComponent() {
  //console.log(' res frontend ........', window.paypal)
  useEffect(() => {
    window.paypal.Button.render(
      {
        env: 'sandbox', // Or 'production'
        // Set up the payment:
        // 1. Add a payment callback
        payment: function (data, actions) {
          // 2. Make a request to your server
          return actions.request
            .post('http://localhost:5000/api/v3/payments/create-payment')
            .then(function (res) {
              console.log(' res frontend ........', res)

              // 3. Return res.id from the response
              return res.id
            })
        },
        // Execute the payment:
        // 1. Add an onAuthorize callback
        onAuthorize: function (data, actions) {
          // 2. Make a request to your server
          return actions.request
            .post('http://localhost:5000/api/v3/payments/execute-payment', {
              paymentID: data.paymentID,
              payerID: data.payerID,
            })
            .then(function (res) {
              console.log(' ...... excute frontend ........', res)
              // 3. Show the buyer a confirmation message.
              alert('payment got successful')
            })
        },
      },
      '#paypal-button',
    )
  }, [])
  return (
    <div>
      <CardTemplate />
      <div id="paypal-button"></div>
    </div>
  )
}
//    <h1>Paypal integration</h1>
