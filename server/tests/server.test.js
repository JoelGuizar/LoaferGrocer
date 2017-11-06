const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {User} = require ('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js')

beforeEach(populateUsers);
// test lifecycle method, this one let us run code BEFORE every single test case
beforeEach(populateTodos);

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
      //checks what actually got stored in the mongodb, this is why we required the model in order to test the database too after
      .end((err, res) => {
        //handles if errors, if it does it'll wrap it with done
        if (err) return done(err)
        //makes request to DB to make sure it was added (since theres not error at this point)
        Todo.find({text}).then((todos)=>{
          //assertion
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          //remember you need 'done' for any asynchronous code so it waits!
          done();
          //it'll get any errors that might occur inside the callback, if so, then it'll call done
        }).catch((e) => done(e));
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
          //must catch since there's a bunch of async chaining
        }).catch(e => done(e))
      })
  })
});

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      //creating a custom assertion with this cb w/response.
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', ()=>{
  //specifies an aysnc test
  it('should return todo doc', (done)=>{
    request(app)
    //to convert object id to string = to HexString(), we are using the todos test case up top
      .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) =>{
          expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    let nid = new ObjectId().toHexString()
    request(app)
    //make a new ID and see if its not found
      .get(`/todos/${nid}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
    ///a bad url for IDs
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })

});

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
          //so error gets rendered by mocha
          if (err) return done(err)

          Todo.findById(hexID).then((doc) =>{
            expect(todo).toNotExist();
            done();
          }).catch(e => done(e))
        })
  });

  it('should return 404 if todo not found', (done) =>{
    let nid = new ObjectId().toHexString()
    request(app)
    //make a new ID and see if its not found
      .delete(`/todos/${nid}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 if object id is invalid', (done) =>{
    request(app)
     ///a bad url for IDs
      .delete('/todos/123abc')
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
        //dont need this end cb since you sent the send method instead of creating your own test case here
      }).catch(e => done(e))
  })

  it('should return 404 if object id isnt valid', (done) => {
    let nid = new ObjectId().toHexString()
    request(app)
      .patch(`/todos/${nid}`)
      .expect(404)
      .end(done)
  })
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done)=>{
    request(app)
      .get('/users/me')
      //how to set a header, first arg is name of header, then 2nd is value
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0]).email);
      })
      .end(done);
  })

  it('should return 401 if not authenticated', (done) =>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('it should create a user', (done) => {
    let email = 'email@email.com';
    let pw = '123abc';

    request(app)
      .post('/users')
      .send({email, pw})
      .expect(200)
      .expect((res) => {
        //we use [] notation because there's a hyphen
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.find({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(pw);
          done();
        })
      })
  })

  it('should return validation errors if request invalid', (done) => {
    //send invalid email, 400 back
    request(app)
      .post('/users')
      .send({
        email:'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    //use email already taken
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done)
  })
})
