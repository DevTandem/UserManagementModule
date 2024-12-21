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

const update_resource = async (req, res) => {
    const {qty} = req.body;
    const {r_id} = req.params;
    const obj = req.user

    if(!obj) return res.json({message: "No auth found"})

    try {
        const u_id = await user.findOne({
            where : {
                id : obj.id
            }
        })

        const check_edit = await resource_ug_map.findAll({
            where : {
                user_id : u_id.id,
                resource_id : r_id,
                edit_op : true
            }
        })

        if(!check_edit) return res.status(400).json({message: "You do not have permission to edit resource"})

        if(!qty){
            return res.status(400).json({message : "Please provide all the details"})
        }

        const edit_data = await resource.update(
            {qty : qty},
            {
                where : {
                    id : r_id
                }
            }
        )

        return res.status(200).json({ message: "Resource updated successfully", edit_data });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {
    update_resource
}