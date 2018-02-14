const bcrypt = require('bcryptjs');
const colors = require('colors');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("hello", salt);

console.log(hash.rainbow);