const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connect to MongoDB server');
  console.log('connected to MongoDB');

  db.collection('Users').deleteMany({'name': 'Joel'}).then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => console.log(err))

  db.collection('Users').deleteOne({_id: new ObjectID("59a0a9137af2e5c7283ead28")}).then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => console.log(err) )

  db.close();
})
