const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

//one user with an auth token, one without an auth token.

const userOneId = new ObjectId();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  token: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{

}]

const todos = [{
  _id: new ObjectId(), //making a test case
  text: 'First test todo'
}, {
  _id: new ObjectId(),
  text: 'Second test todo'
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

module.exports = {todos, populateTodos}
