const express = require("express")
const warehouse_control = require("../controllers/warehouse")

const warehouse_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

warehouse_router.post("/login/organization/create_warehouse",auth_middleware,warehouse_control.create_warehouse)

module.exports = warehouse_router