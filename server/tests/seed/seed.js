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
  _id: userTwoId,
  email: 'joel@joeljoel.com',
  password: 'userTwoPass',
  token: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}]

const todos = [{
  _id: new ObjectId(), //making a test case
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectId(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => { //remove all users
    return Todo.insertMany(todos);
  }).then(() => done());
}

const populateUsers = (done) => {
  Todo.remove({}).then(() => {
    let userOne = new User(user[0]).save();
    let userTwo = new User(user[1]).save();
    // when you need to both above to succeed, promise.all takes an array of promises,
    // then you can call then -- it'll get call once all the promises resolve
    return Promise.all([userOne,userTwo])
  }).then(() => done())
};

module.exports = {todos, populateTodos, users, populateUsers}
