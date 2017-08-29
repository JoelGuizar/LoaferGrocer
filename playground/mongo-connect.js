//const MongoClient = require('mongodb').MongoClient;//mongoClient lets you connect to a mongo server and use methods
const {MongoClient, ObjectID} = require('mongodb'); //using ES6 object destructing, the {var} is pulling from the object mongodb which has the MongoClient key,
//and it's ripping it out // this also does what the above does//both variables in brackets have been ripped and created

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //connects to the db server, mongo doesnt create it until we start adding data in it
  if (err) {
    return console.log('Unable to connect to MongoDB server'); //return so the function stops, we can use else but cleaner this way
  }

  // db.collection('Todos').insertOne({ // lets you insert a new object into your collection
  //   text: 'Something to do',
  //   completed: false,
  // }, (err, result) => { // cb which only called if things didnt go well
  //   if (err) return console.log('Unable to insert todo', err);
  //   console.log(JSON.stringify(result.ops)); // if there's no error being returned
  // }) //only one argument = the string name for the collection you wanna insert it into

  // db.collection('Users').insertOne({
  //   name: "Joel",
  //   age: 27,
  //   location: "San Jo"
  // }, (err, res) => {
  //   if (err) return console.log('Unable to insert User', err);
  //   console.log(JSON.stringify(res.ops, undefined, 2)); //ops is the actual 'object' of the result
  // })

  db.close(); //disconnects from the server
  console.log('Connected to MongoDB');
}); //2 args: a string, the URL where the db lives, sometimes its an amazon web services URL // sometimes its a heroku URL
