'use strict';

const CONNECT_STRING = 'mongodb://localhost:27017/hapi-demo'
const Hapi = require('@hapi/hapi');
const jwt = require('jsonwebtoken'); 
const Mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require('bcrypt');
require('dotenv').config()

Mongoose.connect(CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const PersonModel = Mongoose.model("student", {
    name: String,
    age: Number,
    address: String,
    username: String,
    password: String
});

const PostModel = Mongoose.model("post", {
    title: String,
    content: String,
});

const auth = async (req) => {
    let authHeader = req.headers?.authorization
    console.log(authHeader)

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log('token', token)

        await jwt.verify(token, "SECRET-KEY", (err, data) => {
            console.log(err, data)
            if (data) {
                return true;
            }
            return false
        });
    }
    return false
}


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: "POST",
        path: '/posts',
        options: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    content: Joi.string().required(),
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
                }
            },
        },
        handler: async (req, j) => {
            try {
                if(auth(req)){
                    const post = new PostModel(req.payload);
                    const result = await post.save();
                    if(result){
                        return {success: true, message: "Post success", data: result}
                    }
                    return {success: false, message: "Post failed"}
                }else{
                    return {success: false, message: "Unauthorized"}
                }
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    })

    server.route({
        method: "GET",
        path: '/posts',
        handler: async (req, h) => {
            try {
                if(auth(req)){
                    const result = await PostModel.find();
                    if(result){
                        return {success: true, message: "Get posts successfully", data: result}
                    }
                    return {success: false, message: "Get posts failed"}
                }else{
                    return {success: false, message: "Unauthorized"}
                }
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    })
    
    
    server.route({
        method: "POST",
        path: "/login",
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(6).required(),
                    password: Joi.string().min(6).required(),
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const username = request.payload.username;
                const result = await PersonModel.findOne({username: username})
                const match = result && await bcrypt.compareSync(username, result.password);
                if(match){
                    const accessToken = jwt.sign({id: result._id}, "SECRET-KEY", {expiresIn: 86400})
                    return {"success": true, "message": "login success",jwt: accessToken};
                }else{
                    return {
                        "success": false,
                        'message': 'login failed'
                    }
                }
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/student',
        handler: async (req, h) => {
            const result = await PersonModel.find().select(['-__v', '-password']);
            return result
        }
    })

    

    server.route({
        method: "POST",
        path: "/student",
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(6).required(),
                    password: Joi.string().min(6).required(),
                    name: Joi.string().min(3).required(),
                    age: Joi.number().min(10).optional(),
                    address: Joi.string().optional()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const username = request.payload.username;
                const duplicate = await PersonModel.findOne({username: username})
                if(!duplicate){
                    const hashedPassword = await bcrypt.hash(username, 10);
                    request.payload.password = hashedPassword;
                    const person = new PersonModel(request.payload);
                    const result = await person.save();
                    return {"success": true, data: result};
                }else{
                    return {
                        "success": false,
                        'message': 'username has used by another one'
                    }
                }
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});




init();