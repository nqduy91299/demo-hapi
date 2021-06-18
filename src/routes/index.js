const student = require('./students');
const login = require('./login');
const post = require('./posts');
const classes = require('./class')

module.exports =  [].concat(student, login, post, classes)