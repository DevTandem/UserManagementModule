const express = require("express")
const deactivate_user_control = require("../controllers/deactivate_user")

const deactivate_user_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

deactivate_user_router.post("/login/warehouse/deactivate_user" , auth_middleware , deactivate_user_control.deactivate)

module.exports = deactivate_user_router