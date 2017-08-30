const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true
  },
  completedAt: {
    date: Number,
    default: Date
  }
})

module.exports = {
  User: User
}
