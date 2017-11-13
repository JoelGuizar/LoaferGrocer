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
  _creator: {
    // what we need to set our type to in order to set the creator property/objectId property
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})//mongoose model so mongoose knows how to store our Data,
// first arg = name of mondel, second = object to specify the model
// more options are available in the docs other than 'type'

module.exports = {
  Todo: Todo
}
