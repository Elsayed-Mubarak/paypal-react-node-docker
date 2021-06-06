var whitelist = ['http://localhost:3000', 'https://www.sandbox.paypal.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
module.exports = { corsOptions }
