require("dotenv").config()
const { Sequelize, DataTypes, Op, useInflection } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const UserModel = require("../db/models/user");
const users = UserModel(sequelize, DataTypes)

const deactivate = async (req,res) => {
    const {id} = req.body
    const obj = req.user
    const {warehouse_id} = req.query
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

        return res.status(200).json({
            status : 200,
            message : "User Deactivated successfully",
            data : null,
            error : null,
            success : true
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            status: 500, 
            message : "Internal server error",
            data: null,        
            error: error,       
            success: false      
        });
    }
}


module.exports = {
    deactivate
}