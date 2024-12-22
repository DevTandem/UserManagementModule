const express = require("express")
const resource_controller = require("../controllers/resources")

const resource_router = express.Router()
const {auth_middleware} = require("../middleware/auth")
const {resource_map} = require("../middleware/map_res2ug")

resource_router.post("/login/warehouse/create_resource" , auth_middleware , resource_controller.create_resource , resource_map)
resource_router.get("/login/warehouse/get_all_resources" , auth_middleware , resource_controller.get_all_resources)

module.exports = resource_router