const express = require('express');
const bodyParser = require('body-parser'); //takes your JSON and turns it into an Obj
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require ('./models/todo.js');
const {User} = require('./models/user.js');

const app = express();
const PORT = 3000;

// app.use(bodyParser.urlencoded({
//   extended: true
// }))
app.use(bodyParser.json()); // the bodyparser method we are using

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })

  todo.save().then((doc) => {
    console.log(doc);
  }, (e) => {
    console.log('uh oh!');
  })
})



app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})
