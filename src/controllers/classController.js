const Classes = require('../models/Class')

class classController{
    async getAll(req, h) {
        try{
            const result = Classes.find().select(['-__v']);
            if(result){
                if (result) {
                    return {
                        success: true,
                        message: "Get successfully",
                        data: result,
                    };
                }
                return { success: false, message: "Get failed" }; 
            }
        } catch (error) {
            return h.response(error).code(500);
        }
    }
    async create(req, h) {
        try{
            const c = new Classes(req.payload);
            const result = await c.save();
            if (result) {
                return { success: true, message: "Class create success", data: result };
            }
            return { success: false, message: "Class create failed" };
        } catch (error) {
            return h.response(error).code(500);
        }
    }
}

module.exports = new classController;