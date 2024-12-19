require("dotenv").config()

module.exports = {
    reset_secret : process.env.RESET_SECRET_KEY,
    secret : process.env.JWT_SECRET_KEY
}