const express = require("express")
const u2ug_map_control = require("../controllers/user_ug_map")

const u2ug_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

u2ug_router.post("/login/warehouse/user_group_map/:ug_id/:user_id/add",auth_middleware , u2ug_map_control.add_user_to_ug)
u2ug_router.post("/login/warehouse/user_group_map/:ug_id/:user_id/remove",auth_middleware , u2ug_map_control.remove_user_from_ug)

module.exports = u2ug_router