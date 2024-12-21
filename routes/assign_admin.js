const express = require("express")
const assign_control = require("../controllers/assign_admin")

const assign_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

assign_router.post("/login/warehouse/:warehouse_id/:user_id/assign_admin" , auth_middleware , assign_control.assign_admin)
assign_router.post("/login/warehouse/:warehouse_id/:user_id/remove_admin",auth_middleware,assign_control.remove_assign)
assign_router.get("/login/warehouse/:warehouse_id/get_all_admins",auth_middleware,assign_control.getAllUsers)
module.exports = assign_router