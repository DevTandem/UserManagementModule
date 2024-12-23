const express = require("express")
const verify_control = require("../controllers/otp_verification")

const verify_router = express.Router()

verify_router.post("/super_user_signUp/verify_otp",verify_control.super_user_verify_otp)
verify_router.post("/signUp/verify_otp" ,verify_control.verify_otp )

module.exports = verify_router