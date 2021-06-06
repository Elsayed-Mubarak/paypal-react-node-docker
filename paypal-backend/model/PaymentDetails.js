const mongoose = require('mongoose')

const PaymentDetails = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: [
      'Credit Card',
      'ePayment Network',
      'Scratch Card',
      'PAYPAL',
      'bank Deposit',
      'Cash',
    ],
  },

  paymentProviderName: {
    type: String,
  },
  paymentAmount: { type: Number },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  transactionCode: {
    type: String,
  },
  transactionDetails: [
    {
      details: {
        subtotal: { type: Number, default: 0.0, maxlength: 3000 },
        shipping: { type: Number, default: 0.0, maxlength: 3000 },
        insurance: { type: Number, default: 0.0, maxlength: 3000 },
        handling_fee: { type: Number, default: 0.0, maxlength: 3000 },
        shipping_discount: { type: Number, default: 0.0, maxlength: 3000 },
        discount: { type: Number, default: 0.0, maxlength: 3000 },
      },
    },
  ],

  paymentId: {
    type: String,
  },
  payerId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: [
      'Not_Create',
      'Created',
      'Approved',
      'Captured',
      'Refunded',
      'Partially Refunded',
      'VERIFIED',
    ],
  },
  feesAmount: {
    type: Number,
    default: 0.0,
  },
  feesCurrency: {
    type: String,
    default: 'USD',
  },
})

module.exports = mongoose.model('PaymentDetails', PaymentDetails)
