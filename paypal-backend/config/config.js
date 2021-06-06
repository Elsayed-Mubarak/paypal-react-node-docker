var mongoose = require('mongoose')
mongoose.set('debug', true)
var { database } = require('./db.json')

mongoose
  .connect(database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log('................    mongoose connected     ..............')
  })
