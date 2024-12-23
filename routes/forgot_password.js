const express = require("express")
const {forgot_password} = require("../controllers/forgot_password")
const {forgot_pass_middleware} = require("../middleware/auth")


const forgot_pass_router = express.Router()

forgot_pass_router.put("login/reset_password/:token",forgot_pass_middleware,forgot_password)

module.exports = forgot_pass_router