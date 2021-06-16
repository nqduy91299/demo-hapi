const Joi = require("joi");

module.exports = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3).required(),
    age: Joi.number().min(10).optional(),
    address: Joi.string().optional()
})