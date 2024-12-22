const express = require("express")

const ma_control = require("../controllers/edit_user_group_access")
const ma_router = express.Router()

const {auth_middleware} = require("../middleware/auth")
const e = require("express")

ma_router.put("/login/warehouse/user_group/:resource_id",auth_middleware,ma_control.edit_user_group_access)

module.exports = ma_router