const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Class = new Schema({
    name: {type: String, required: true},
})

module.exports = mongoose.model('class', Class, 'classes')