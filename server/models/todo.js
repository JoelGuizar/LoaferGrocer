const mongoose = require('mongoose')

const Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  complete: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})//mongoose model so mongoose knows how to store our Data,
// first arg = name of mondel, second = object to specify the model
// more options are available in the docs other than 'type'

module.exports = {
  Todo: Todo
}

//
// const newTodo = new Todo({
//   text: 'Cook dinner',
//   complete: false,
//   completedAt: 123
// }) //constructor composed of prior attributes
//
// const newUser = new User({
//   email: 'Lol'
// })
//
// newUser.save().then((doc) => {
//   console.log(doc)
// }, e => console.log('unable to save User'))
//
// newTodo.save().then((doc) => {
//   console.log(doc)
// }, e => console.log('Unable to save todo')) // actually saves to the mongoose database
