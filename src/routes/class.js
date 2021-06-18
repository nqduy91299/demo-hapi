
const classController = require('../controllers/classController')

const routes = [
    {
        method: 'GET',
        path: '/class',
        handler: classController.getAll
    },
    {
        method: 'POST',
        path: '/class',
        handler: classController.create
    },
]

module.exports = routes