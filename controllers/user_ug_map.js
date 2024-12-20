require("dotenv").config()
const { Sequelize, DataTypes } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)
const UserModel = require("../db/models/user")
const user = UserModel(sequelize, DataTypes)
const user2ugModel = require("../db/models/user_ug_map");
const user2ug = user2ugModel(sequelize,DataTypes)
const ugModel = require("../db/models/user_group");
const user_group = ugModel(sequelize,DataTypes)



const add_user_to_ug = async(req,res) => {
    const {user_id,ug_id} = req.params
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MAP_USER_TO_USERGROUP");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to add users to user groups"})
        }

        const user_admin = await user.findOne({id:obj.id})

        const ug = await user_group.findOne({id:ug_id,warehouse_id: user_admin.warehouse_id})

        if(!ug)
            return res.status(400).json({message:"User group doesn't exists in the warehouse"})

        const User = await user.findOne({id:user_id, warehouse_id: user_admin.warehouse_id})

        if(!User) 
            return res.status(400).json({message:"User doesn't exists in the warehouse"})

        const user_permission = await u_map.findAll({
            user_id: user_id
        })

        const adminPersmission = user_permission.some(permission => permission.p_name === "MAP_USER_TO_USERGROUP");
        if(adminPersmission)
            return res.status(400).json({message:"User is an admin"})

        const user_ug_map_check = await user2ug.findOne({
            user_id: user_id,
        })

        if(!user_ug_map_check){
            const assign_u2ug = await user2ug.create({
                user_id:user_id,
                ug_id:ug_id,
                warehouse_id: user_admin.warehouse_id
            })

            
        }else{
            console.log("User was before in UG id:",user_ug_map_check.ug_id)

            const remove_u2ug_map = await user2ug.destroy({
                where:{
                    user_id:user_id,
                    ug_id: ug_id
                }
            })

            const assign_u2ug = await user2ug.create({
                user_id:user_id,
                ug_id:ug_id,
                warehouse_id: user_admin.warehouse_id
            })
        }

        return res.status(200).json({message: "User has been assigned to the user group successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }

}

const remove_user_from_ug = async(req,res) => {
    const {user_id,ug_id} = req.params
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MAP_USER_TO_USERGROUP");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to add users to user groups"})
        }

        const user_admin = await user.findOne({id:obj.id})

        const ug = await user_group.findOne({id:ug_id,warehouse_id: user_admin.warehouse_id})

        if(!ug)
            return res.status(400).json({message:"User group doesn't exists in the warehouse"})

        const User = await user.findOne({id:user_id, warehouse_id: user_admin.warehouse_id})

        if(!User) 
            return res.status(400).json({message:"User doesn't exists in the warehouse"})

        const user_ug_map_check = await user2ug.findOne({
            user_id: user_id,
            ug_id: ug_id,
            warehouse_id: user_admin.warehouse_id
        })

        if(!user_ug_map_check)
            return res.status(400).json({message: "User does not belong to the specified user group"})

        const remove_u2ug_map = await user2ug.destroy({
            where:{
                user_id:user_id,
                ug_id: ug_id
            }
        })

        return res.status(200).json({message: "User has been successfully removed from the user group"})
        
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    add_user_to_ug,
    remove_user_from_ug
}