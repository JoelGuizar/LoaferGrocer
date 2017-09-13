const express = require('express');
const env = process.env.NODE_ENV || 'development'; //heroku
const _ = require('lodash');
const bodyParser = require('body-parser'); //takes your JSON and turns it into an Obj
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require ('./models/todo.js');
const {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');
const {authenticate} = require('./middleware/authenticate')

const app = express();
const PORT = 3000 || process.env.PORT //this process.env.port is how heroku can set the port for hosting

if (env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest' // if /else statement dependendent on which mode you are on!
}


// app.use(bodyParser.urlencoded({
//   extended: true
// }))
app.use(bodyParser.json()); // the bodyparser method we are using

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  console.log(req.body.text);

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})



app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos}) // don't just send an array, by putting it in an object you are more flexible to add more properties to the response
  }, (e) => {res.status(400).send(e)})
})

app.get('/todos/:id', (req, res) => {
  let id = req.params.id //will take the params.id from the request body, which is the :id
    if (!ObjectId.isValid(id)){
      return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
      if (!todo){
        return res.status(404).send();
      }
      res.send({todo})
    }).catch(e => {res.status(400).send()})
})

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id //where the URL parameter are stored.
  if (!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
      return rest.status(404).send();
    }

    res.status(200).send({todo})
  }).catch(e => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']) //takes obj, then array of properties you cann pull off

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo) => { //takes the ID, which mongo method to use, then options -- the "new" = option to show the updated object afterwards
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}) // same as {todo: todo}
  }).catch((e) => {
    res.status(400).send();
  }) //methods for updating
})


app.post('/users', (req, res) => {
  let body = new User(_.pick(req.body, ['email', 'password']))

  body.save().then(() => {
    return body.generateAuthtoken();
    //res.status(200).send(doc)
  }).then((token) => {
    res.header('x-auth', token).send(body) //setting auth token as header, header name //x-auth = custom header, second = value
  }).catch((e) => {
    res.status(404).send()
  })
})





app.get('/users/me', authenticate, (req, res) =>{ //will use authenticate as a middleware first
  res.send(req.user);
})

//POST users login if they have token
//when you sent a matching email, and pw that bcrypt compares with hashedpassword

app.post('/users/login', (req, res) => {


  User.findByCredentials(req.body.email, req.body.password).then((user) => {
    user.generateAuthtoken().then((token) => {
      res.header('x-auth', token).send(user) 
    })
  }).catch((e) => {
    res.status(400).send();
  })
})


app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})


module.exports = {app};
