const mongoose = require('mongoose');
const validator = require('validator'); //custom validation library

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value) // or validator: validator.isEmail will work
      },
      message: 'valid'
    }
  },
  completedAt: {
    date: Number,
    default: Date
  },
  password: {
    type: String,
    require: true,
    minLength: 6
  },
  tokens: [{
    
  }]
})

module.exports = {
  User: User
}
