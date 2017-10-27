const mongoose = require('mongoose')
const MONGODB_URI =

//we have to describe that we are gonna use the mongoose promise library
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
}) //stays connected

module.exports = {
  mongoose: mongoose
}
