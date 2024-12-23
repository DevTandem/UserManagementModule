const express = require("express")
const {validate_email} = require("../controllers/validate_email")

const validate_email_router = express.Router()

validate_email_router.get("/login/validate_email",validate_email)

module.exports = validate_email_router