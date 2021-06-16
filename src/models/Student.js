const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    name: {type: String, required: true},
    age: {type: Number},
    address:  {type: String},
    username:  {type: String},
    password:  {type: String, required: true},
}, {
    timestamps: true
}) ;

module.exports = mongoose.model('student', Student);
