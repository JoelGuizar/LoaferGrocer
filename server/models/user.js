const mongoose = require('mongoose');
const validator = require('validator'); //custom validation library
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

//a custom method to generate token
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


//custom method to OVERRIDE the json, so that only SOME info gets sent back

UserSchema.methods.toJSON = function () {
  var user = this; //readability
  var userObject = user.toObject() //responsible for taking your mongoose variable, and creates an object to where the only ones available in the doc are there

  return _.pick(userObject, ['_id', 'email']) //making the new Object and selecting the attributes
})

UserSchema.statics.findByToken = function (token) {
  let User = this; // this = model here, not the instance
  let decoded; //jwt will throw error

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {

  }

  //if success decoded after try //

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token, //queries that value in their token array
    "tokens.access": 'auth'
  })
} //.statics is like .methods except the function turns into a MODEL methods INSTEAD of an INSTANCE method.

const User = mongoose.model('User', UserSchema)



module.exports = {
  User: User
}
