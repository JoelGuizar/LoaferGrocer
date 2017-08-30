const express = require('express');
const bodyParser = require('body-parser'); //takes your JSON and turns it into an Obj
const {mongoose} = require('./db/mongoose.js');
var {Todo} = require ('./models/todo.js');
const {User} = require('./models/user.js');

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



app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
})


module.exports = {app};
