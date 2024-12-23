const express = require("express")
const warehouse_control = require("../controllers/warehouse")

const warehouse_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

warehouse_router.post("/login/organization/create_warehouse",auth_middleware,warehouse_control.create_warehouse)
warehouse_router.get("/login/organization/get_all_warehouses",auth_middleware,warehouse_control.getAllWarehouse)

module.exports = warehouse_router