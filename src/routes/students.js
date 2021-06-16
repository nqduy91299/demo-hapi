const createStudentValidate = require('../validations/create-student');
const studentController = require('../controllers/studentController');


const routes = [
    {
        method: 'GET',
        path: '/student',
        handler: studentController.getAll
    },
    {
        method: "POST",
        path: "/student",
        options: {
            validate: {
                payload: createStudentValidate,
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
                }
            }
        },
        handler: studentController.create
    }
]

module.exports = routes