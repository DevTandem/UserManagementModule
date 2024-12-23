require("dotenv").config()
const { Sequelize, DataTypes, Op} = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);

const u_map_p = require("../db/models/user_permission_map")
const u_map = u_map_p(sequelize , DataTypes)
const warehouse_model = require("../db/models/warehouse");
const warehouse = warehouse_model(sequelize , DataTypes)
const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)
const d2u_invite_model = require("../db/models/d2u_invite")
const d2u_invite = d2u_invite_model(sequelize, DataTypes)



const assign_admin = async (req,res) => {
    const {warehouse_id,user_id} = req.query
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try{
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "ASSIGN_ADMIN");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to assign admin"})
        }

        const Warehouse = await warehouse.findOne({
            id: warehouse_id
        })

        if(!Warehouse){
            return res.status(404).json({message: "Warehouse doesn't exist"})
        }

        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id,
                p_name:{
                    [Op.ne]: "ORGANIZATION_USER"
                }
            }
        })

        const user_admin = user_permission.find(permission => permission.p_name == "CREATE_USER")

        if(user_admin){
            return res.status(400).json({message: "User can't be made as an admin "})
        }

        const user_warehouse_check = user_permission.every(permission => permission.warehouse_id == warehouse_id) //true or false

        if(!user_warehouse_check){
            return res.status(400).json({message: "User belongs to some other warehouse "})
        }
        
        const check_org_user = await u_map.findOne({
            where:{
                p_name: "ORGANIZATION_USER"
            }
        })

        if (check_org_user){
            await user.update(
                {
                    warehouse_id: warehouse_id,
                },
                {
                    where : {
                        id: user_id,
                    }
                },
            )
        }

        if(user_permission.length>0 || check_org_user){
            const remove_permission = await u_map.destroy({
                where:{
                    user_id : user_id
                }
            })
            
        }
      

        const permissionList = ["CREATE_USER", "ACCESS_WAREHOUSE", "CREATE_USER_GROUP","MAP_USER_TO_USERGROUP","MANAGE_USER_GROUP_ACCESS","ASSIGN_USER_GROUP","MANAGE_USERS","MANAGE_RESOURCES"];

        for (const permission of permissionList) {
            await u_map.create({
                user_id: user_id,
                p_name: permission,
                warehouse_id: warehouse_id
            });
        }
        
        return res.status(200).json({
            status : 200,
            message : "User has been assigned as an admin successfully",
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


const getAllUsers = async (req, res) => {
  const { warehouse_id } = req.query;
  const obj = req.user;
  if (!obj) return res.json({ message: "No auth found" });

  try {
    const check_permission = await u_map.findAll({
      where: {
        user_id: obj.id,
      },
    });
    const hasPermission = check_permission.some((permission) => permission.p_name === "ASSIGN_ADMIN");

    if (!hasPermission) {
      return res.status(403).json({ message: "You do not have permission to get all users" });
    }

    const excludedUserIds = await u_map.findAll({
      attributes: ['user_id'],
      where: {
        p_name: "ASSIGN_ADMIN",
      },
    }).then((rows) => rows.map((row) => row.user_id));

    const users = await user.findAll({
      where: {
        warehouse_id: {
          [Op.or]: [warehouse_id, null],
        },
        id: {
          [Op.notIn]: excludedUserIds,
        },
      },
      limit:10
    });

    if (users.length===0) {
      return res.status(400).json({ message: "No user found" });
    }

    return res.status(200).json({
        status : 200,
        message : "Successfully fetched the users",
        data : users,
        error : null,
        success : true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
            status: 500, 
            message : "Internal server error",
            data: null,        
            error: error,       
            success: false      
        });  }
};


const remove_assign = async (req,res) => {
    const {warehouse_id,user_id} = req.query
    const obj = req.user
    if(!obj) return res.json({message: "No auth found"})

    try{
        const check_permission = await u_map.findAll({
            where : {
                user_id : obj.id
            }
        })
        const hasPermission = check_permission.some(permission => permission.p_name === "ASSIGN_ADMIN");

        if(!hasPermission){
            return res.status(403).json({message : "You do not have permission to remove admin"})
        }

        const Warehouse = await warehouse.findOne({
            id: warehouse_id
        })

        if(!Warehouse){
            return res.status(404).json({message: "Warehouse doesn't exist"})
        }

        const user_permission = await u_map.findAll({
            where : {
                user_id : user_id
            }
        })

        const user_admin = user_permission.some(permission => permission.p_name == "CREATE_USER")

        if(!user_admin){
            return res.status(400).json({message: "User is not an admin "})
        }

        const User = await user.findOne({
            where : {
                id: user_id
            }
        })

        const check_super_user = await d2u_invite.findOne({
            where : {
                email: User.email
            }
        })

        if(check_super_user){
            return res.status(400).json({message: "Super user permissions cannot be revoked "})
        }

        const user_warehouse_check = user_permission.every(permission => permission.warehouse_id == warehouse_id) //true or false

        if(!user_warehouse_check){
            return res.status(400).json({message: "User belongs to some other warehouse "})
        }

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
                warehouse_id: warehouse_id
            });
        }
        
        return res.status(200).json({
            status : 200,
            message : "Admin has been removed successfully and made user successfully",
            data : null,
            error : null,
            success : true
        })
        
    }catch(error){
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
    assign_admin,
    getAllUsers,
    remove_assign,
}