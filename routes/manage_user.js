const express = require("express")
const manage_user_control = require("../controllers/manage_user")

const manage_user_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

manage_user_router.post("/login/warehouse/:user_id/add_to_warehouse" , auth_middleware , manage_user_control.assign_user_to_warehouse)
manage_user_router.post("/login/warehouse/:user_id/remove_from_warehouse" , auth_middleware , manage_user_control.remove_user_from_warehouse)
manage_user_router.get("/login/warehouse/get_all_users" , auth_middleware , manage_user_control.getAllUsersInWarehouse)

module.exports = manage_user_router