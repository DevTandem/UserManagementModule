require("dotenv").config()
const { Sequelize, DataTypes } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/u2pmap");
const u_map = u_map_p(sequelize , DataTypes)
const resource_ug_map_model = require("../db/models/resource_ug_map")
const resource_ug_map = resource_ug_map_model(sequelize, DataTypes)

const edit_user_group_access = async (req , res) => {
    const manage_access = req.body
    const obj = req.user
    const {warehouse_id, resource_id} = req.params

    if(!obj) return res.json({message: "No auth found"})
    
    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })

        const hasPermission = check_permission.some(permission => permission.name === "MANAGE_USER_GROUP_ACCESS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage user group access"})
        }

        for (var key in manage_access){
            ma = manage_access[key]
            if(ma["policy"]==1){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        warehouse_id : warehouse_id
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
                        warehouse_id : warehouse_id
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
            else if(ma["policy"]==2){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        organizationId : obj.organizationId
                    }
                })
                const res_map = await resource_ug_map.update(
                    {edit_op : true},
                    {
                    where: {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        id : parseInt(p_id.id),
                        organizationId : obj.organizationId
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
            else if(ma["policy"]==0){
                const p_id = await resource_ug_map.findOne({
                    where : {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        organizationId : obj.organizationId
                    }
                })
                const res_map = await resource_ug_map.update(
                    {read_op : false, edit_op : false},
                    {
                    where: {
                        ug_id: ma["ug_id"],
                        resource_id: parseInt(resource_id),
                        id : parseInt(p_id.id),
                        organizationId : obj.organizationId
                    },
                })
                if(!res_map) return res.status(404).json({message: "Error in updating data of resource_ug_map table"})
            }
        }
        return res.status(200).json({message: "Successfully changed the policies"})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    edit_user_group_access
}