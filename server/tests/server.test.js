const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo')

const todos = [{
  _id: new ObjectId(), //making a test case
  text: 'First test todo'
}, {
  _id: new ObjectId(),
  text: 'Second test todo'
}]

beforeEach((done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos)
  }).then(() => done());
}) // test lifecycle method, this one let us run code BEFORE every single test case

describe('POST /todos', () => {


  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text}) //since we are doing a POST request we need to send data,
                    //it gets converted to JSON automatically
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {   //checks what actually got stored in the mongodb, this is why we required the model in order to test the database too after
        if (err) return done(err) //handles if errors, if it does it'll wrap it with done
        Todo.find({text}).then((todos)=>{ //makes request to DB to make sure it was added (since theres not error at this point)
          expect(todos.length).toBe(1);  //assertion
          expect(todos[0].text).toBe(text);
          done(); //remember you need done for any asynchronous code so it waits!
        }).catch((e) => done(e)); //it'll get any errors that might occur inside the callback, if so, then it'll call done
      })
  })

  it('should not create todo with invalid object', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e)) //must catch since there's a bunch of async
      })
  })
})

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => { //creating a custom assertion with this cb with response
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', ()=>{
  it('should return todo doc', (done)=>{ //specifies an aysnc test
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) //to convert object id to string = to HexString(), we are using the todos test case up top
        .expect(200)
        .expect((res) =>{
          expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    let nid = new ObjectId().toHexString()
    request(app)
      .get(`/todos/${nid}`)  //make a new ID and see if its not found
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc') ///a bad url for IDs
      .expect(404)
      .end(done)
  })

})
