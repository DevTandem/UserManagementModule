const express = require("express")
const user = require("../controllers/user")

const user_router = express.Router()

user_router.post("/signUp" ,user.signUp)
user_router.get("/login",user.login)
user_router.post("/super_user_signUp",user.super_user_signUp)

module.exports = user_router