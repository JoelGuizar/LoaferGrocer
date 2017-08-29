const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connect to MongoDB server');
  console.log('conneceted to MongoDB');

  db.collection('Todos').find().count().then((doc) => { //converts into an array
    console.log('Todos');
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  }) // can be used with no arguments --
  // no args = fetch everything, to Array returns a promise -- FIND returns a mongoDB CURSOR
  // -- it's a pointer to the document -- to Array is a cursor method, instead of a cursor it's converts it into an array of obj

  // db.collection('Todos').find().count().then((doc) => { //converts into an array
  //   console.log('Todos');
  //   console.log(JSON.stringify(doc, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // })

  db.collection('Users').find().count().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch users', err);
  })

  //damnamndamnd

  db.close();
})
