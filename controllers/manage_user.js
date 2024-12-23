require("dotenv").config()
const { Sequelize, DataTypes, Op} = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)
const UserModel = require("../db/models/user")
const user = UserModel(sequelize, DataTypes)
const user2ugModel = require("../db/models/user_ug_map");
const user2ug = user2ugModel(sequelize,DataTypes)



const assign_user_to_warehouse = async (req,res) => {
    const {user_id} = req.query
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})


    try{
        console.log("user_id",user_id)
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.find(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({
            where : {
                id:obj.id
            }
        })
        
        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id,
                p_name: {
                    [Op.ne] : "ORGANIZATION_USER"
                }
            }
        })
        console.log("id",user_permission.user_id)
        if(user_permission.length>0){
            return res.status(400).json({message: "User is already assigned to some warehouse"})
        }

        const update_user = await user.update(
            {warehouse_id: user_admin.warehouse_id},
            {
                where:{
                    id: user_id
                }
            }
        )
        const remove_permission = await u_map.destroy({
            where:{
                user_id : user_id
            }
        })

        const permissionList = ["ACCESS_WAREHOUSE"];        //later permissionsList has to be changed if there is any change in users persmission

        for (const permission of permissionList) {
            await u_map.create({
                user_id: user_id,
                p_name: permission,
                warehouse_id: user_admin.warehouse_id
            });
        }

        return res.status(200).json({
            status : 200,
            message : "User has been assigned to the warehouse successfully",
            data : null,
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

const remove_user_from_warehouse = async (req,res) =>{
    const {user_id} = req.query
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})


    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.find(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({
            where : {
                id:obj.id
            }
        })

        if(user_admin.id === user_id){
            return res.status(400).json({message: "You can't remove yourself from the warehouse"})
        }

        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id,
                warehouse_id: user_admin.warehouse_id
            }
        })
        const user_permission_2 = await user.findOne({
            where:{
                id : user_id,
                warehouse_id: user_admin.warehouse_id
            }
        })

        if(!user_permission.length && !user_permission_2){
            return res.status(400).json({message: "User does not exist in your warehouse"})
        }

        const remove_permission = await u_map.destroy({
            where:{
                user_id : user_id
            }
        })

        const permissionList = ["ORGANIZATION_USER"];       
          
          for (const permission of permissionList) {
              await u_map_p.create({
                  user_id: find_user.id,
                  p_name: permission,
                  warehouse_id: null
              });
          }

        const user_ug_map_check = await user2ug.findOne({
            where : {
                user_id : user_id,
                warehouse_id: user_admin.warehouse_id
            }
        })

        if(user_ug_map_check){
            const remove_u2ug_map = await user2ug.destroy({
                where:{
                    user_id:user_id,
                    ug_id: user_ug_map_check.ug_id,
                    warehouse_id: user_admin.warehouse_id
                }
            })
        }
        
        const update_user = await user.update(
            {
                warehouse_id:null

            },
            {
                where:{
                    id:user_id
                }
            }
        )

        return res.status(200).json({
            status : 200,
            message : "User has been removed from the warehouse successfully",
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


const getAllUsersInWarehouse = async (req,res) => {
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.find(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const user_admin = await user.findOne({
            where : {
                id:obj.id
            }
        })

        const excludedUserIds = await u_map.findAll({
            attributes: ['user_id'],
            where: {
              p_name: "MANAGE_USERS",
            },
          }).then((rows) => rows.map((row) => row.user_id));

        const users = await user.findAll({
            where:{
                warehouse_id: user_admin.warehouse_id,
                id: {
                    [Op.notIn]: excludedUserIds,
                  },
            },
            limit: 10
        })

        if(!users.length)
            return res.status(400).json({message: "No users found in the "})

        return res.status(200).json({
            status : 200,
            message : "Users",
            data : users,
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

const getAllUsersNotInAnyWarehouse = async (req,res)=>{
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try {
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "MANAGE_USERS");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to manage users"})
        }

        const users = await u_map_p.findAll({
            where:{
                p_name:"ORGANIZATION_USER",
                warehouse_id: null
            },
            limit: 10
        })
        
        if(!users.length)
            return res.status(400).json({message: "No users found"})

        return res.status(200).json({
            status : 200,
            message : "Users",
            data : users,
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
    assign_user_to_warehouse,
    remove_user_from_warehouse,
    getAllUsersInWarehouse,
    getAllUsersNotInAnyWarehouse
}
