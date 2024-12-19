const jwt = require("jsonwebtoken")
const {secret, reset_secret} = require("../config/jwtConfig")

const auth_middleware = async(req,res,next) => {
    var token = req.params.token

    if(!token) {
        return res.status(404).json({message : "Access denied , no token provided"})
    }

    try {
        console.log("token",token)
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        console.log("decoded",decoded)
        next()
    } catch (error) {
        console.log(error)
    }
}

const forgot_pass_middlware = async (req,res,next) => {
    var token = req.params.token

    if(!token) {
        return res.status(404).json({message : "Access denied , no token provided"})
    }

    try {
        console.log("token",token)
        const decoded = jwt.verify(token, reset_secret)
        req.user = decoded
        console.log("decoded",decoded)
        next()
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    auth_middleware,
    forgot_pass_middlware
}