require("dotenv").config()
const { Sequelize, DataTypes, Op, where } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)
const bcryptjs = require("bcryptjs");

const forgot_password = async (req, res) => {
    const { new_password, confirm_password } = req.body
    // const { email } = req.params
    const obj = req.user

    try {
        if (new_password != confirm_password) {
            return res.status(400).json({ message: "Passwords do not match" })
        }

        const hash_password = bcryptjs.hashSync(confirm_password);

        const update_password = await user.update({
            password : hash_password
        },
        {
            where : {
                email : obj.email
            }
        })

        if (update_password) {
            return res.status(200).json({ message: "Password updated successfully" })
        }

        return res.status(500).json({ message: "Failed to update password" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { 
    forgot_password 
}
