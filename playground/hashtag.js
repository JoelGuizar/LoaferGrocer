const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken')

jwt.sign //takes obj, and signs it, creates hash, and returns token value
jwt.verify //does opposite, makes sure data wasnt manipulated

let data = {
  id: 10
}

let token = jwt.sign(data, '123abc');
console.log(token);

let decoded = jwt.verify(token, '123abc')
console.log(decoded); //if token chaned before calling verify, it will throw an error

//these methods ^^, do the same as vv

//
// let msg = 'I am user number 3';
// let hash = SHA256(msg).toString();
//
// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);
//
// let data = {
//   id: 4
// }
//
//
// let token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'secretSalt').toString() //data to string, then hash, then to String
// } ///salt gets added to the string, so the hash will be different every single time instead of using the same hash key
//
// //
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secretSalt').toString()
//
// if (resultHash === token.hash){
//   //means that the data wasnt changed since its the same
//   console.log('data was not changed');
// } else {
//   console.log('data was changed');
// }
