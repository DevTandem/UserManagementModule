require("dotenv").config()
const { Sequelize, DataTypes, Op, where } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)
const resourceModel = require("../db/models/resource")
const resource = resourceModel(sequelize, DataTypes)
const resource_ug_map_model = require("../db/models/resource_ug_map")
const resource_ug_map = resource_ug_map_model(sequelize, DataTypes)
const u_map_p = require("../db/models/user_permission_map");
const user_group = require("../db/models/user_group");
const u_map = u_map_p(sequelize , DataTypes)
const u2ug_model = require("../db/models/user_ug_map")
const u2ug = u2ug_model(sequelize, DataTypes)

const update_resource = async (req, res) => {
    const {add_qty, sub_qty} = req.body
    const {r_id} = req.params;
    const obj = req.user

    if(!obj) return res.json({message: "No auth found"})

    try {
        
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })

        const hasPermission = check_permission.find(permission => permission.p_name === "MANAGE_RESOURCES");

        var Warehouse_id;

        if(!hasPermission){
            const u_id = await u2ug.findOne({
                where : {
                    user_id : obj.id
                }
            })


            if(!u_id) return res.status(400).json({message: "You are not assigned to any ug"})
    
            Warehouse_id = u_id.warehouse_id

            const check_edit = await resource_ug_map.findAll({
                where : {
                    ug_id : u_id.ug_id,
                    resource_id : r_id,
                    edit_op : true
                }
            })
    
            if(!check_edit.length) return res.status(400).json({message: "You do not have permission to edit resource"})
    
        }else{
            Warehouse_id = hasPermission.warehouse_id
        }

        

        if(!add_qty && !sub_qty){
            return res.status(400).json({message: "Enter the quantity of products required"})
        }

        const resource_detail = await resource.findOne({
            where: {
                id:r_id,
                warehouse_id : Warehouse_id
            }
        })

        if(!resource_detail) {
            return res.status(404).json({message: "Resource not found"})
        }
        
        var edit_data

        if(add_qty){
            const rem_qty = resource_detail.qty + parseInt(add_qty)
            edit_data = await resource.update(
                {qty : rem_qty},
                {
                    where : {
                        id : r_id
                    }
                }
            )
        }else{

            const check_qty = resource_detail.qty - parseInt(sub_qty)
            
            if(check_qty < 0){
                return res.status(200).json({message: `Available quantity for the product is ${product_detail.qty}`})
            }
            
            const rem_qty = check_qty
            edit_data = await resource.update(
                {qty : rem_qty},
                {
                    where : {
                        id : r_id
                    }
                }
            )
        }


        return res.status(200).json({ message: "Resource updated successfully" });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {
    update_resource
}