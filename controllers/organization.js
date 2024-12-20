require("dotenv").config()
const { Sequelize, DataTypes, Op } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const org_model = require("../db/models/organization")
const org = org_model(sequelize , DataTypes)
const permission_model = require("../db/models/permission")
const permission = permission_model(sequelize , DataTypes)
const u_map_p = require("../db/models/u2pmap");
const u_map = u_map_p(sequelize , DataTypes)

const create_organization = async (req , res ) => {
    const {name , description} = req.body;
    const obj = req.user

    try {

        const check_permission = await u_map.findOne({
            where : {
                user_id : obj.id
            }
        })
        
        const hasPermission = check_permission.some(permission => permission.name === "ONBOARD_ORGANIZATION");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to create organization"})
        }

        if(!name || !description){
            return res.status(400).json({message : "Please provide all the details"})
        }

        const organization = await org.create({
            name : name,
            description : description
        }) 

        console.log(`Organization created : ${organization}`)
        return res.status(200).json({message : "Organization created successfully" , organization : organization})
            
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

const getAllOrganizations = async(req,res) => {
    const obj = JSON.parse(req.user)

    if(!obj) return res.json({message: "No auth found"})        

    try {
        
        const organizations = await org.findAll()

        if(!organizations.length()){
            return res.status(404).json({message:"No organizations found"})
        }

        console.log(`Organizations :\n ${organizations}`)

        return res.status(200).json({organizations})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    create_organization,
    getAllOrganizations
}