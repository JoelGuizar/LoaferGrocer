const mongoose = require('mongoose');
const validator = require('validator'); //custom validation library
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  //User can go here
  {
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
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  }
})

UserSchema.methods.generateAuthtoken = function (){
  var user = this; //so we know what 'this' is
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

  user.tokens.push({
    access: access,
    token: token
  })

  return user.save().then(()=>{
    return token;
  })
}  //how you add instance methods, need this

const User = mongoose.model('User', UserSchema)



module.exports = {
  User: User
}
