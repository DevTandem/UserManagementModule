const express = require("express")
const dev_control = require("../controllers/developer")

const dev_router = express.Router()

dev_router.get("/dev_login",dev_control.login)

module.exports = dev_router