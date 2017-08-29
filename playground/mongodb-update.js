const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connect to MongoDB server');
  console.log('connected to MongoDB');

  db.collection('Users').findOneAndUpdate({name: 'Joel'},
    {$set: { //this is the update operator that has to be used
      name: 'JoelJoelJoel'
    }}, {
      returnOriginal: false
    }).then((doc) => console.log(JSON.stringify(doc, undefined, 2)))
  db.close();
})
