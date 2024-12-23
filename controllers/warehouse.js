require("dotenv").config()
const { Sequelize, DataTypes} = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const warehouse_model = require("../db/models/warehouse")
const warehouse = warehouse_model(sequelize , DataTypes)
const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)
const org_model = require("../db/models/organization");
const org = org_model(sequelize , DataTypes)



const create_warehouse = async (req,res) => {
    const {name} = req.body

    const obj = req.user

    if(!obj) return res.json({message: "No auth found"})


    try {

        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        
        const hasPermission = check_permission.some(permission => permission.p_name === "CREATE_WAREHOUSE");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to create warehouse"})
        }

        if(!name){
            return res.status(400).json({message : "Please provide all the details"})
        }

        const organization = await org.findAll()
        if(!organization){
            return res.status(404).json({message: "No organization exists"})
        }

        const new_warehouse = await warehouse.create({
            name : name,
            organization_id : organization[0].id
        })

        if(!new_warehouse){
            return res.status(400).json({message: "Error while creating warehouse"})
        }

        console.log(`Warehouse created : ${new_warehouse}`)
        return res.status(200).json({
            status : 200,
            message : "Warehouse created successfully",
            data : new_warehouse,
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
        });    }
}


module.exports = {create_warehouse}