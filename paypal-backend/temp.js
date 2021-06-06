

//...........................encrypt............................//
const crypto = require('crypto')

/*
const algorithm = 'aes-192-cbc'
const password = '2001MyForever'

// We will first generate the key, as it is dependent on the algorithm.
// In this case for aes192, the key is 24 bytes (192 bits).
crypto.scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err
  // After that, we will generate a random iv (initialization vector)
  crypto.randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err

    // Create Cipher with key and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = ''
    cipher.setEncoding('hex')

    cipher.on('data', (chunk) => (encrypted += chunk))
    cipher.on('end', () =>
      console.log('...............Encrypted Data..........', encrypted),
    ) // Prints encrypted data with key

    cipher.write('some clear text data')
    cipher.end()
  })
})
*/
//...........................dycrypt............................//

const algorithm2 = 'aes-192-cbc'
const password2 = '2001MyForever'

const key = crypto.scryptSync(password2, 'salt', 24)
const iv = Buffer.alloc(16, 0)
const decipher = crypto.createDecipheriv(algorithm2, key, iv)

let decrypted = ''
decipher.on('readable', () => {
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8')
  }
})

decipher.on('end', () => {
  console.log("............decrypted...............",decrypted)
  // Prints: some clear text data
})

// Encrypted with same algorithm, key and iv.
const encrypted =
  'b539c1c8b78363d666bd63a292ea7adddb33eb5628cd11b6a378cca1525d92a9'
decipher.write(encrypted, 'hex')
decipher.end()

//...........................dycrypt............................//




const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

mongoose.connect('mongodb://localhost/test', (err) => {
  if (err) throw err;
  console.log('Mongoose connected!');
});
const User = mongoose.model('User', { name: String });

app.post('/user', async (req, res) => {
  try {
    const user = new User({ name: req.body.username });
    await user.save();
    res.send('Success!').status(201);
  } catch (err) {
    res.send(err.message).status(500);
  }
});

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'));

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });
});







/*



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>PayPal Node App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">

</head>

<body>
  <div style="text-align: center;">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
      crossorigin="anonymous"></script>
    <h1>ISEC PAYMENT GETWAY</h1>
    <h2>Buy For USD</h2>

    <div style="display: flex;">
      <form action="/api/pay" method="post" class="row g-3"  style="display: flex;align-items: center;margin: 0 auto;">
        <div class="col-auto">
          <label for="inputPassword2" class="visually-hidden">Money</label>
          <input type="text" class="form-control" id="money" placeholder="money $">
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary mb-3" style="margin-top: inherit;">Buy</button>
        </div>
      </form>
    </div>
  </div>
</body>

</html>

*/


  
/* Copyright 2015-2016 PayPal, Inc. */
"use strict";

var paypal = require('../../');
require('../configure');

var create_payment_json = {
    "intent": "authorize",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
            if (payment.links[index].rel === 'approval_url') {
                console.log(payment.links[index].href);
            }
        }
        console.log(payment);
    }
});

var execute_payment_json = {
    "payer_id": "Appended to redirect url",
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "1.00"
        }
    }]
};

var paymentId = 'PAYMENT id created in previous step';

paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
    }
});




try {
  const paymentDetails = new PaymentDetails()
  paymentDetails.paymentMethod = 'PAYPAL'
  paymentDetails.paymentProviderName = payment.recipient_name
  paymentDetails.paymentAmount = payment.transactions.map((itm) => {
    itm.amount.total
  })
  paymentDetails.paymentDate = payment.create_time
  paymentDetails.transactionCode = payment.id
  paymentDetails.transactionDetails = payment.transactions.map((itm) => {
    return itm.amount.details
  })
  paymentDetails.paymentId = payment.id
  paymentDetails.payerId = payment.payer.payer_info.payer_id
  paymentDetails.paymentStatus = 'Approved'
  paymentDetails.paymentStatusHistory.push({
    fromStatus: 'Approved',
    toStatus: 'Captured',
    changeAt: payment.update_time,
    reason: 'No Reason',
  })
  paymentDetails.feesAmount = payment.transactions.map((itm) => {
    itm.amount.total
  })
  paymentDetails.feesCurrency = payment.transactions.map((itm) =>
    itm.item_list.items.find((nestedItm) => {
      nestedItm.currency.toString()
    }),
  )
  paymentDetails
    .save()
    .then((savedItem) => res.send({ value: savedItem }))
} catch (error) {
  console.log(' ............error..........', error)
}






//...................................................................//



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
              name: 'Red Sox Hat',
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
        description: 'Hat for the best team ever',
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
      res.send('Success');
    }
  })
}

const cancel = (req, res) => res.send('Cancelled')

module.exports = { doPayment, success, cancel }
