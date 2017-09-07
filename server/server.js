const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser'); //takes your JSON and turns it into an Obj
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require ('./models/todo.js');
const {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');

const app = express();
const PORT = 3000 || process.env.PORT //this process.env.port is how heroku can set the port for hosting

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

  Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  }) //methods for updating
})


app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})


module.exports = {app};
