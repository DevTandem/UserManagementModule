require("dotenv").config()
const { Sequelize, DataTypes, Op } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const InviteModel = require("../db/models/u2u_invite")
const invite = InviteModel(sequelize , DataTypes)
const d2uInviteModel = require("../db/models/d2u_invite")
const d2uInvite = d2uInviteModel(sequelize , DataTypes)
const user_permission_map_model = require("../db/models/user_permission_map")
const user_permission_map = user_permission_map_model(sequelize, DataTypes)
const UserModel = require("../db/models/user")
const user = UserModel(sequelize, DataTypes)
const otpModel = require("../db/models/otp");
const { use } = require("../routes/organization");
const otp = otpModel(sequelize, DataTypes)

const verify_otp = async (req , res) => {

    const {input_otp} = req.body
    const {email} = req.params

    try {
        const stored_otp = await otp.findOne({
            where : {
                email : email ,
            }
        })
        const check_user = await invite.findOne({email:email})

        if(!check_user)
          return res.status(400).json({message : "You can't access this page"})

        console.log("expiry",stored_otp.expiresAt)
        console.log(`Stored otp : ${stored_otp}`)

        if (!stored_otp || stored_otp.expiresAt < new Date()) {
            return res.status(400).json({ message: "Expired OTP.(Go back to signup page)" });
        }
        console.log(input_otp)

        if(stored_otp.otp != input_otp){
            return res.status(400).json({message: "Incorrect OTP.(Stay on the same page)"})
        }
          
        await otp.destroy({
          where: {
            id: stored_otp.id
          }
        });
    
        await invite.update(
          {register_status: true},
          {
            where:{
              email: email
            },
          }
        )

        

        await user.update({
          status:true,
        },
      {
        where : {
          email : email
        }
      })

      const find_user = await user.findOne({
        where : {
          email : email
        }
      })
      console.log("email", find_user.email)
      console.log("id",find_user.id)
      console.log("warehouse_id",find_user.warehouse_id)
        if(find_user.warehouse_id!=null){
          const permissionList = ["ACCESS_WAREHOUSE"];        //later permissionsList has to be changed if there is any change in users persmission

          for (const permission of permissionList) {
              await user_permission_map.create({
                  user_id: find_user.id,
                  p_name: permission,
                  warehouse_id: find_user.warehouse_id
              });
          }
        }

        return res.status(200).json({ message: "OTP verified successfully." });
        
    } catch (error) {
        console.log(error)
    }
}


const super_user_verify_otp = async (req , res) => {

  const {input_otp} = req.body
  const {email} = req.params

  try {
      const stored_otp = await otp.findOne({
          where : {
              email : email,
          }
      })
      const check_user = await d2uInvite.findOne({email:email})

      if(!check_user)
        return res.status(400).json({message : "You can't access this page"})

      console.log("expiry",stored_otp.expiresAt)
      console.log(`Stored otp : ${stored_otp}`)

      if (!stored_otp || stored_otp.expiresAt < new Date()) {
          return res.status(400).json({ message: "Expired OTP.(Go back to signup page)" });
      }
      console.log(input_otp)

      if(stored_otp.otp != input_otp){
          return res.status(400).json({message: "Incorrect OTP.(Stay on the same page)"})
      }
        
      await otp.destroy({
        where: {
          id: stored_otp.id
        }
      });
  
      await invite.update(
        {register_status: true},
        {
          where:{
            email: email
          },
        }
      )

      await user.update({
        status:true,
      },
    {
      where : {
        email : email
      }
    })

    const User = await user.findOne({
      where : {
        email : email
      }
    })

      const permissionList = ["ONBOARD_ORGANIZATION", "CREATE_WAREHOUSE", "CREATE_USER","ASSIGN_ADMIN"];

      for (const permission of permissionList) {
        await user_permission_map.create({
            user_id: User.id,
            p_name: permission
        });
      }
    return res.status(200).json({ message: "OTP verified successfully." });

  } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Internal server error" });

  }
}

module.exports = {
    verify_otp,
    super_user_verify_otp
}