const mongoose = require('mongoose')
const MONGODB_URI =

mongoose.Promise = global.Promise //we have to describe that we are gonna use the mongoose promise library
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
}) //stays connected

module.exports = {
  mongoose: mongoose
}
