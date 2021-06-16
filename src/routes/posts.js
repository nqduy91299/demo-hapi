const createPostValidate = require('../validations/create-post');
const postController = require('../controllers/postController')

const routes = [
    {
        method: "POST",
        path: "/posts",
        options: {
            validate: {
                payload: createPostValidate,
                failAction: (request, h, error) => {
                    return error.isJoi
                        ? h.response(error.details[0]).takeover()
                        : h.response(error).takeover();
                },
            },
        },
        handler: postController.create
    },
    {
        method: "GET",
        path: "/posts",
        handler: postController.getAll
    },
];

module.exports = routes