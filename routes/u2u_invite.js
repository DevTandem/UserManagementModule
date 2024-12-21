const express = require("express")
const u_invite_control = require("../controllers/u2u_invite")

const u_invite_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

u_invite_router.post("/login/warehouse/invite" , auth_middleware , u_invite_control.u2u_invite_controller)

module.exports = u_invite_router