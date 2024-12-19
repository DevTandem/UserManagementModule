const jwt = require("jsonwebtoken")
const {secret , reset_secret} = require("../config/jwtConfig")

const generate_token = (user) => {
    const payload = {
        id : user.id,
        fname : user.fname,
        lname : user.lname,
        email : user.email,
        mobile_number : user.mobile_number,
        organizationId : user.organizationId,
        role : user.role
    }

    return jwt.sign(payload , secret , {expiresIn:'1h'})
}

const reset_token = (user) => {
    const payload = {
        email : user.email
    }

    return jwt.sign(payload,reset_secret , {expiresIn: 2*60})
}
module.exports = {
    generate_token,
    reset_token
}