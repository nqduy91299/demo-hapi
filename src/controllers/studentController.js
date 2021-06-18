const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

class StudentController{

    async create(request, h){
        try {
            const username = request.payload.username;
            const duplicate = await Student.findOne({ username: username })
            if (!duplicate) {
                const hashedPassword = await bcrypt.hash(username, 10);

                request.payload.password = hashedPassword;

                const person = new Student(request.payload);
                const result = await person.save();
                
                return { "success": true, data: result };
            } else {
                return {
                    "success": false,
                    'message': 'username has used by another one'
                }
            }
        } catch (error) {
            return h.response(error).code(500);
        }
    }

    async login(request, h) {
        try {
            const username = request.payload.username;
            const result = await Student.findOne({ username: username })
            const match = result && await bcrypt.compareSync(username, result.password);
            if (match) {
                const accessToken = jwt.sign({ id: result._id }, "SECRET-KEY", { expiresIn: 86400 })
                return { "success": true, "message": "login success", jwt: accessToken };
            } else {
                return {
                    "success": false,
                    'message': 'login failed'
                }
            }
        } catch (error) {
            return h.response(error).code(500);
        }
    }

    async getAll(req, h){
        try {
            const result = await Student.find().select(['-__v', '-password']);
            return {success: true, data: result, message: 'Get successful'}
        } catch (error) {
            return h.response(error).code(500);
        }
    }
}
module.exports = new StudentController;