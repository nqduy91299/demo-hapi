const mongoose = require('mongoose');
const CONNECT_STRING = 'mongodb://localhost:27017/hapi-demo'
const connect = async () => {
    try {
        await mongoose.connect(CONNECT_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('connect db successful!')
    } catch (error) {
        console.log('connect db failure!')
    }
}

module.exports = connect;