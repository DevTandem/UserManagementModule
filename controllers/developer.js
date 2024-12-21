require("dotenv").config()
const { Sequelize, DataTypes, Op } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const dev_model = require("../db/models/developer")
const developer = dev_model(sequelize , DataTypes)
const {dev_generate_token}  = require("../utils/generateToken")

const login = async (req , res) => {
    const {email , password} = req.body;

    try {
        const check_user = await developer.findOne({
            where : {
                email : email
            }
        })

        if(!check_user) {
            return res.status(404).json({message : "Developer not found"})
        }

        const hashed_password = password === check_user.password

        if(!hashed_password) {
            return res.status(400).json({message : "Invalid password"})
        }
        console.log("login successful");

        token = dev_generate_token(check_user)

        res.send(token)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {
    login
}