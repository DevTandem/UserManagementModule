const express = require("express")
const d_invite_control = require("../controllers/d2u_invite")

const d_invite_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

d_invite_router.post("/login/organization/:organization_id/invite" , auth_middleware , d_invite_control.d2u_invite_controller)

module.exports = d_invite_router