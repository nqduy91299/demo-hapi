
const loginValidate = require('../validations/login')
const studentController = require('../controllers/studentController')


const routes = [{
    method: "POST",
    path: "/login",
    options: {
        validate: {
            payload: loginValidate,
            failAction: (request, h, error) => {
                return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
            }
        }
    },
    handler: studentController.login
}]

module.exports = routes