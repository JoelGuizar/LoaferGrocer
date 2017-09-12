const todos = [{
  _id: new ObjectId(), //making a test case
  text: 'First test todo'
}, {
  _id: new ObjectId(),
  text: 'Second test todo'
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}
