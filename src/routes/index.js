const student = require('./students');
const login = require('./login');
const post = require('./posts');

module.exports =  [].concat(student, login, post)