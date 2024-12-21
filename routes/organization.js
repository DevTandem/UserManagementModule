const express = require("express")
const organization_control = require("../controllers/organization")

const organization_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

organization_router.post("/login/create_organization" , auth_middleware , organization_control.create_organization)

module.exports = organization_router
