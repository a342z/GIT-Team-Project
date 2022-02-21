//AUTHORIZATION
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (request, response, next) => {
    let token, decode;
    try {
        token = request.get("Authorization").split(" ")[1];
        decode = jwt.verify(token, process.env.SECRET_KEY)
    }
    catch (error) {
        error.message = "Not Authorized";//not auth for any  one
        error.status = 403;
        next(error);
    }

    if (decode != undefined) {
        request.role = decode.role 
        next();
    }
}