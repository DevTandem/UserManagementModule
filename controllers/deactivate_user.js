require("dotenv").config()
const { Sequelize, DataTypes, Op, useInflection } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const UserModel = require("../db/models/user");
const users = UserModel(sequelize, DataTypes)

const deactivate = async (req,res) => {
    const {id} = req.body
    const obj = req.user
    const {warehouse_id} = req.params
    if(!obj) return res.json({message: "No auth found"})

    try{
        const user = await users.update(
            {status : false},
            {
            where:{
                id: id,
                warehouse_id: warehouse_id
            },
        })

        console.log(user)
        if(!user) return res.status(404).json({message: "User not found"})

        return res.status(200).json({message: "User de-activated successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(400).json({message: "Internal Server Error"})
    }
}


module.exports = {
    deactivate
}