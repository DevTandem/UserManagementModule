require("dotenv").config()
const { Sequelize, DataTypes } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/user_permission_map");
const u_map = u_map_p(sequelize , DataTypes)
const resource_ug_map_model = require("../db/models/resource_ug_map")
const resource_ug_map = resource_ug_map_model(sequelize, DataTypes)
const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)

const edit_user_group_access = async (req , res) => {
    const manage_access = req.body
    const obj = req.user
    const {resource_id} = req.query

    if(!obj) return res.json({message: "No auth found"})
    
    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })

        const hasPermission = check_permission.some(permission => permission.p_name === "MANAGE_USER_GROUP_ACCESS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage user group access"})
        }

        const User = await user.findOne({
            where: {
                id: obj.id
            }
        })

        for (var key in manage_access){
            ma = manage_access[key]
            if(ma["policy"]==1){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        warehouse_id : User.warehouse_id
                    }
                })

                console.log("id",p_id.id)
                const res_map = await resource_ug_map.update(
                    {read_op : true},
                    {
                    where: {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        id : parseInt(p_id.id),
                        warehouse_id : User.warehouse_id
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
            else if(ma["policy"]==2){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        warehouse_id : User.warehouse_id
                    }
                })
                const res_map = await resource_ug_map.update(
                    {edit_op : true},
                    {
                    where: {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        id : parseInt(p_id.id),
                        warehouse_id : User.warehouse_id
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
            else if(ma["policy"]==0){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        warehouse_id : User.warehouse_id
                    }
                })
                const res_map = await resource_ug_map.update(
                    {read_op : false, edit_op : false},
                    {
                    where: {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        id : parseInt(p_id.id),
                        warehouse_id : User.warehouse_id
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
        }
        return res.status(200).json({
            status : 200,
            message : "Successfully changed the policies",
            data : null,
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

module.exports = {
    edit_user_group_access
}