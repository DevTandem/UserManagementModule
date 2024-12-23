require("dotenv").config()
const { Sequelize, DataTypes, Op, where } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const UserGroupModel = require("../db/models/user_group")
const user_grp = UserGroupModel(sequelize , DataTypes)
const u2ug_model = require("../db/models/user_ug_map")
const u2ug = u2ug_model(sequelize , DataTypes)
const u_map_p = require("../db/models/user_permission_map");
const user_model = require("../db/models/user");
const user = user_model(sequelize , DataTypes)
const u_map = u_map_p(sequelize , DataTypes)

const create_user_grp = async (req , res ) => {
    const { name } = req.body
    const obj = req.user
    const {warehouse_id} = req.params
    
    try {

        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id,
                warehouse_id : warehouse_id
            }
        })

        const hasPermission = check_permission.find(permission => permission.p_name === "CREATE_USER_GROUP");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to create user group"})
        }

        if(!name){
            return res.status(400).json({message : "Please provide all the details"})
        }

        
        const adminPermission = check_permission.some(permission=>permission.warehouse_id >=0);
        // const superAdminPermission = check_permission.some(permission=>permission.warehouse_id === null);

        
        const create_user_group = await user_grp.create({
            name : name,
            warehouse_id : warehouse_id
        })
        return res.status(200).json({
            status : 200,
            message : "User group created successfully",
            data : create_user_group,
            error : null,
            success : true
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500, 
            message : "Internal server error",
            data: null,        
            error: error,       
            success: false      
        });    }
}

const getAllUserGroups = async (req,res) =>{

    const obj = req.user

    if(!obj) return res.json({message: "No auth found"})
    

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })

        const hasPermission = check_permission.some(permission => permission.name === "CREATE_USER_GROUP");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to create user group"})
        }
        
        const user_groups = await user_grp.findAll()

        if(!user_groups.length()){
            return res.status(404).json({message : "No user groups found"})
        }

        console.log(`User groups :\n${user_groups}`)
        return res.status(200).json({
            status : 200,
            message : "User groups:",
            data : user_groups,
            error : null,
            success : true
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500, 
            message : "Internal server error",
            data: null,        
            error: error,       
            success: false      
        });    }
}

const delete_user_group = async( req , res ) => {
    const {ug_id} = req.params
    const obj = req.user

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })

        const hasPermission = check_permission.find(permission => permission.p_name === "CREATE_USER_GROUP");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to delete user group"})
        }

        const admin = await user.findOne({
            where : {
                id : obj.id
            }
        })

        const check_ug = await user_grp.findOne({
            where : {
                warehouse_id : admin.warehouse_id,
                id: ug_id
            }
        })

        

        if(check_ug.warehouse_id !== hasPermission.warehouse_id){
            return res.status(403).json({message : "User group does not exist in your warehouse"})
        }

        const users_in_ug = await u2ug.destroy(
            {
            where : {
                ug_id : ug_id
            }
        })
        
        const delete_ug = await user_grp.destroy({
            where : {
                id : ug_id
            }
        })

        return res.status(200).json({
            status: 200, 
            message : "User group deleted successfully",
            data: null,        
            error: null,       
            success: true      
        });
        
    } catch (error) {
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
    create_user_grp,
    getAllUserGroups,
    delete_user_group
}