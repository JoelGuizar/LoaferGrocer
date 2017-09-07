const mongoose = require('mongoose')

mongoose.Promise = global.Promise //we have to describe that we are gonna use the mongoose promise library
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
}) //stays connected

module.exports = {
  mongoose: mongoose
}
