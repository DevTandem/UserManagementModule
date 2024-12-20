require("dotenv").config()
const { Sequelize, DataTypes, Op, where } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const UserModel = require("../db/models/user");
const users = UserModel(sequelize, DataTypes)
const UserGroupModel = require("../db/models/user_group")
const userGroup = UserGroupModel(sequelize, DataTypes)
const resource_ug_map_model = require("../db/models/resource_ug_map")
const resource_ug_map = resource_ug_map_model(sequelize, DataTypes)
const u2pmap = require("../db/models/u2pmap");
const u_map = u2pmap(sequelize, DataTypes)

const resource_map = async (req,res) => {
    const r_id = req.rid
    const obj = req.user
    console.log("Object" ,obj)

    try{

        const warehouse = await users.findOne({
            where : {
                 id : obj.id
            }
        })

        const UserGroups = await userGroup.findAll({
            where: {
                warehouse_id : warehouse.warehouse_id
            }
        })

        if(!UserGroups) return res.status(400).json({message: "Error in fetching all User Groups"})

        
        for (var key in UserGroups){
            
            ug_id = UserGroups[key]
            console.log(ug_id)
            const res_map = await resource_ug_map.create({
                resource_id: r_id,
                ug_id: ug_id["id"],
                warehouse_id: warehouse.warehouse_id,
                read_op: false,
                edit_op: false
            })
            // if(!res_map) return res.status(400).json({message: "Error in inserting value to table"})
        }

        // return res.status(200).json({message: "Successfully inserted values"})
        return res.status(200).json({message: "Resource created successfully"})

    }
    catch(error){
        console.log(error)
        return res.status(400).json({message: "Internal Server Error"})
    }
}

module.exports =  {resource_map}
