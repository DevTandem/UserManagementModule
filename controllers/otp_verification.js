require("dotenv").config()
const { Sequelize, DataTypes, Op } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const InviteModel = require("../db/models/u2u_invites")
const invite = InviteModel(sequelize , DataTypes)
const d2uInviteModel = require("../db/models/d2u_invites")
const d2uInvite = d2uInviteModel(sequelize , DataTypes)
const user_permission_map_model = require("../db/models/user_permission_map")
const user_permission_map = user_permission_map_model(sequelize, DataTypes)
const UserModel = require("../db/models/user")
const user = UserModel(sequelize, DataTypes)
const otpModel = require("../db/models/otp");
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
          
        await otp.removeAttribute({
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
        
      await otp.removeAttribute({
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

      const User = await user.findOne({
        email:email
      })

      const permissionList = ["ONBOARD_ORGANIZATION", "CREATE_WAREHOUSE", "CREATE_USER"];

      for (const permission of permissionList) {
        await user_permission_map.create({
            user_id: User.id,
            p_name: permission
        });
      }
    return res.status(200).json({ message: "OTP verified successfully." });

  } catch (error) {
      console.log(error)
  }
}

module.exports = {
    verify_otp,
    super_user_verify_otp
}