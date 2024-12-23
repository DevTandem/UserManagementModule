const express = require("express")
const assign_control = require("../controllers/assign_admin")

const assign_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

assign_router.post("/login/warehouse/assign_admin" , auth_middleware , assign_control.assign_admin)
assign_router.post("/login/warehouse/remove_admin",auth_middleware,assign_control.remove_assign)
assign_router.get("/login/warehouse/get_all_users",auth_middleware,assign_control.getAllUsers)

module.exports = assign_router