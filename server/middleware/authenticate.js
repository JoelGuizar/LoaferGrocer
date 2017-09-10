const {User} = require('./../models/user')

const authenticate = (req, res, next) => {
  let token = req.header('x-auth') //req.header gets the value, as res.header SETS the value, so only pass in the key.

  User.findByToken(token).then((user) =>{
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    res.send(user)
    next(); // MUST CALL NEXT so the next CALL BACK gets called, which is the (req, res) => {} in the get route!
  }) //a schema method that you are going to create
    .catch((e) => {
      res.status(401).send()
    })
}

module.exports = {authenticate}
