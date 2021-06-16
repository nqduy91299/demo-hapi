const Post = require('../models/Post');
const auth = require('../utils/auth')

class PostController{
    async create(req, h){
        try {
            if (auth(req)) {
                const post = new Post(req.payload);
                const result = await post.save();
                if (result) {
                    return { success: true, message: "Post success", data: result };
                }
                return { success: false, message: "Post failed" };
            } else {
                return { success: false, message: "Unauthorized" };
            }
        } catch (error) {
            return h.response(error).code(500);
        }
    }

    async getAll(req, h) {
        try {
            if (auth(req)) {
                const result = await Post.find();
                if (result) {
                    return {
                        success: true,
                        message: "Get posts successfully",
                        data: result,
                    };
                }
                return { success: false, message: "Get posts failed" };
            } 
            return { success: false, message: "Unauthorized" };
        } catch (error) {
            return h.response(error).code(500);
        }
    }

}

module.exports = new PostController;