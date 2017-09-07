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

describe('DELETE /todos/:id', () =>{
  it('should remove a todo', (done) => {
    var hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexID)
        })
        .end((err, res) => {
          if (err) return done(err) //so error gets rendered by mocha

          Todo.findById(hexID).then((doc) =>{
            expect(todo).toNotExist();
            done();
          }).catch(e => done(e))
        })
  });

  it('should return 404 if todo not found', (done) =>{
    let nid = new ObjectId().toHexString()
    request(app)
      .delete(`/todos/${nid}`)  //make a new ID and see if its not found
      .expect(404)
      .end(done)
  });

  it('should return 404 if object id is invalid', (done) =>{
    request(app)
      .delete('/todos/123abc') ///a bad url for IDs
      .expect(404)
      .end(done)
  });
})

describe('PATCH /todos/:id' () => {
  it('should update the mongo database', (done) => {
    var hexID = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed: true,
        text: "new text"
      }) //since its patch, you should send something
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, result) => {

      }).catch(e => done(e)) //dont need this end cb since you sent the send method instead of creating your own test case here
  })

  it('should return 404 if object id isnt valid', (done) => {
    let nid = new ObjectId().toHexString()
    request(app)
      .patch(`/todos/${nid}`)
      .expect(404)
      .end(done)
  })
})
