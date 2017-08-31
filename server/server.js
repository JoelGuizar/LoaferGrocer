const express = require('express');
const bodyParser = require('body-parser'); //takes your JSON and turns it into an Obj
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require ('./models/todo.js');
const {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');

const app = express();
const PORT = 3000;

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
      res.status(404).send();
      return console.log('LOL this doesnt exist');
    }

    Todo.findById(id).then((docs) => {
      if (docs){
        res.status(200).send(docs);
        return console.log('SUCCESS!!!', docs);
      }
      res.send(404)
    }).catch(e => {res.status(400).send()})
})



app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})


module.exports = {app};
