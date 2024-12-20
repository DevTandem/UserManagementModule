require("dotenv").config()
const { Sequelize, DataTypes, Op, where} = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)
const UserModel = require("../db/models/user")
const user = UserModel(sequelize, DataTypes)
const user2ugModel = require("../db/models/user_ug_map");
const user2ug = user2ugModel(sequelize,DataTypes)



const assign_user_to_warehouse = async (req,res) => {
    const {user_id} = req.params
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})


    try{
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({id:obj.id})
        
        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id
            }
        })
        if(user_permission){
            return res.status(400).json({message: "User is already assigned to some warehouse"})
        }

        const update_user = await user.update(
            {warehouse_id: user_admin.warehouse_id},
            {
                where:{
                    id: user_id
                }
            }
        )

        const permissionList = ["ACCESS_WAREHOUSE"];        //later permissionsList has to be changed if there is any change in users persmission

        for (const permission of permissionList) {
            await u_map.create({
                user_id: update_user.id,
                p_name: permission,
                warehouse_id: user_admin.warehouse_id
            });
        }

        return res.status(200).json({message: "User has been assigned to the warehouse successfully"})

    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }

}

const remove_user_from_warehouse = async (req,res) =>{
    const {user_id} = req.params
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})


    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({id:obj.id})

        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id,
                warehouse_id: user_admin.warehouse_id
            }
        })
        const user_permission_2 = await user.findOne({
            where:{
                id : user_id,
                warehouse_id: user_admin.warehouse_id
            }
        })

        if(!user_permission && !user_permission_2){
            return res.status(400).json({message: "User does not exist in your warehouse"})
        }

        const remove_permission = await u_map.destroy({
            where:{
                user_id : user_id
            }
        })

        const remove_u2ug_map = await user2ug.destroy({
            where:{
                user_id:user_id,
                ug_id: user_ug_map_check.ug_id,
                warehouse_id: user_admin.warehouse_id
            }
        })

        const update_user = await user.update(
            {
                warehouse_id:null

            },
            {
                where:{
                    id:user_id
                }
            }
        )

        return res.status(200).json({message: "User has been successfully removed from warehouse"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


const getAllUsersInWarehouse = async (req,res) => {
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({id:obj.id})

        const users = await user.findAll({
            where:{
                warehouse_id: user_admin.warehouse_id
            }
        })

        if(!users.length)
            return res.status(400).json({message: "No users found in the "})


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    assign_user_to_warehouse,
    remove_user_from_warehouse,
    getAllUsersInWarehouse
}
