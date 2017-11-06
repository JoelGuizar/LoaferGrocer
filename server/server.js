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

//this process.env.port is how heroku can set the port for hosting
const PORT = 3000 || process.env.PORT
if (env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}


// app.use(bodyParser.urlencoded({
//   extended: true
// }))

app.use(bodyParser.json()); // the bodyparser method we are using

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  console.log(req.body.text);

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})



app.get('/todos', (req, res) => {
  Todo.find({
    //find the Todos with the creator ID, so only person logged in will have access to those todos.
    _creator: req.user._id
  }).then((todos) => {
    // don't just send an array, by putting it in an object you are more flexible to add more properties to the response
    res.send({todos})
  }, (e) => {res.status(400).send(e)})
})

app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id
  //will take the params.id from the request body, which is the :id
    if (!ObjectId.isValid(id)){
      return res.status(404).send();
    }

    Todo.findOne({
      _id: id,
      //make sure they only see their Todos
      _creator: req.user._id
    }).then((todo) => {
      if (!todo){
        return res.status(404).send();
      }
      res.send({todo})
    }).catch(e => {res.status(400).send()})
})

app.delete('/todos/:id', authenticate, (req, res) => {
  //where the URL parameter are stored.
  let id = req.params.id
  if (!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id, _creator: req.user._id
  }).then((todo) => {
    if (!todo){
      return rest.status(404).send();
    }

    res.status(200).send({todo})
  }).catch(e => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  //takes obj, then array of properties you can pull off
  let body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByOneAndUpdate({_id:id, _creator:req.user._id}, {$set:body}, {new:true}).then((todo) => { //takes the ID, which mongo method to use, then options -- the "new" = option to show the updated object afterwards
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo})
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
    //setting auth token as header, header name //x-auth = custom header, second = value
    res.header('x-auth', token).send(body)
  }).catch((e) => {
    res.status(404).send()
  })
})




//will use authenticate as a middleware first
app.get('/users/me', authenticate, (req, res) =>{
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


app.delete('/users/me/token', authenticate, (req, res) => {
  //to remove a token all we need to do is call an instance method/create one

  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})


module.exports = {app};
