const express = require("express")
const update_resource_control = require("../controllers/update_resource")

const update_res_router = express.Router()
const {auth_middleware} = require("../middleware/auth")

update_res_router.post("/login/warehouse/:r_id/update_resource" , auth_middleware , update_resource_control.update_resource)

module.exports = update_res_router