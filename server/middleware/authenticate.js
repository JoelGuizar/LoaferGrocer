const {User} = require('./../models/user')

const authenticate = (req, res, next) => {
  //req.header gets the value, as res.header SETS the value, so only pass in the key.
  let token = req.header('x-auth')

  User.findByToken(token).then((user) =>{
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    res.send(user)
    next();
  })
    .catch((e) => {
      res.status(401).send()
    })
}

module.exports = {authenticate}
