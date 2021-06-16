const jwt = require("jsonwebtoken");

const auth = async (req) => {
    let authHeader = req.headers?.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        await jwt.verify(token, "SECRET-KEY", (err, data) => {
        if (data) {
            return true;
        }
        return false;
        });
    }
    return false;
};

module.exports = auth;
