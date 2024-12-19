const express = require("express")
const user = require("../controllers/user")

const user_router = express.Router()

user_router.post("/signUp" ,user.signUp)
user_router.get("/login",user.login)

module.exports = user_router