const express = require("express")
const user_grp_control = require("../controllers/user_groups")

const user_grp_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

user_grp_router.post("/login/warehouses/create_user_group" , auth_middleware , user_grp_control.create_user_grp)
user_grp_router.get("/login/warehouses/user_grps" , auth_middleware , user_grp_control.getAllUserGroups)
user_grp_router.delete("/login/warehouses/delete_user_group/:ug_id", auth_middleware , user_grp_control.delete_user_group);

module.exports = user_grp_router