require("dotenv").config()
const { Sequelize, DataTypes} = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const org_model = require("../db/models/organization")
const org = org_model(sequelize , DataTypes)
const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)

const create_organization = async (req , res ) => {
    const {name , description} = req.body;
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})


    try {

        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        
        const hasPermission = check_permission.some(permission => permission.p_name === "ONBOARD_ORGANIZATION");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to create organization"})
        }

        if(!name || !description){
            return res.status(400).json({message : "Please provide all the details"})
        }

        const check_organiztion = await org.findAll()

        if(check_organiztion.length>1){
            return res.status(400).json({message: "You can't create more than one organization"})
        }

        const organization = await org.create({
            name : name,
            description : description,
            created_by: obj.id
        }) 

        console.log(`Organization created : ${organization}`)
        return res.status(200).json({
            status : 200,
            message : "Organization created successfully",
            data : organization,
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
    create_organization
}