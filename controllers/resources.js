require("dotenv").config()
const { Sequelize, DataTypes } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const ResourceModel = require("../db/models/resource")
const resource = ResourceModel(sequelize , DataTypes)
const map_res2ug_model = require("../db/models/resource_ug_map");
const map_res2ug = map_res2ug_model(sequelize, DataTypes)
const u2pmap = require("../db/models/user_permission_map");
const u_map = u2pmap(sequelize, DataTypes)

const create_resource = async (req , res ) => {
    const { r_name , qty } = req.body
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        if(!r_name || !qty){
            return res.status(400).json({message : "Please provide all the details"})
        }

        const create_res = await resource.create({
            r_name : r_name,
            qty : qty,
            user_id : obj.id,
            warehouse_id : hasPermission.warehouse_id
        })

        req.rid = resource.id
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

const get_all_resources = async (req , res) => {
    const {warehouse_id , user_group_id} = req.params
    const obj = req.user 

    try {

        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        }) 

        const hasPermission = check_permission.some(permission => permission.name === "MANAGE_RESOURCES");

        if(hasPermission){
            const resources = await map_res2ug.findAll({
                where : {
                    warehouse_id : warehouse_id
                }
            })

            if(!resources.length){
                return res.status(404).json({message:"No Resources found"})
            }

            return res.status(200).json({resources})

        }else{
            const resources = await map_res2ug.findAll({
                where : {
                    warehouse_id : warehouse_id,
                    user_group_id : user_group_id
                }
            })

            if(!resources.length){
                return res.status(404).json({message:"No Resources found"})
            }
            return res.status(200).json({resources})
        }    
                
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})   
    }
}


module.exports = {
    create_resource,
    get_all_resources
}