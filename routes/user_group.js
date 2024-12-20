const express = require("express")
const user_grp_control = require("../controllers/user_groups")

const user_grp_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

user_grp_router.post("/login/warehouses/:warehouse_id/create_user_group" , auth_middleware , user_grp_control.create_user_grp)
user_grp_router.get("/login/warehouses/user_grps" , auth_middleware , user_grp_control.getAllUserGroups)

module.exports = user_grp_router