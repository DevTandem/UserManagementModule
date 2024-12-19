require("dotenv").config()
const { Sequelize, DataTypes, Op } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)
const InviteModel = require("../db/models/u2u_invites")
const invite = InviteModel(sequelize , DataTypes)
const d2uInviteModel = require("../db/models/d2u_invites")
const d2uInvite = d2uInviteModel(sequelize , DataTypes)
const OtpModel = require("../db/models/otp")
const otp = OtpModel(sequelize , DataTypes)
const {generate_token}  = require("../utils/generateToken")
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")
const otp_generator = require("otp-generator");
const schedule = require("node-schedule")

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.SEND_EMAILID,
        pass : process.env.SEND_EMAILID_PASSWORD,
    }
})

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates/'),
  };

  transporter.use('compile', hbs(handlebarOptions))


const signUp = async (req , res) => {
    const {fname , lname , email , password , mobile_number} = req.body;

    if(!fname || !lname || !email || !password || !mobile_number) {
      return res.status(400).json({message : "Please provide all the details"})
    }

    try {

        const check_invite = await invite.findOne({
          where : {
              email : email,
              register_status: false
          }
        })

        if(!check_invite){
            return res.status(400).json({message : "You are not invited or already a user"})
        }

        const hashed_password = await bcrypt.hash(password , 10)

        const new_user = await user.create({
            fname :fname,
            lname : lname,
            email : email,
            password : hashed_password,
            mobile_number : mobile_number,
            status : true
        })

        const pass = otp_generator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        const save_otp = await otp.create({
            otp : pass,
            email : email,
            expiresAt : expiresAt
        })

        const mailOptions = {
            from: process.env.SEND_EMAILID,
            template: "verify_email",
            to: email,
            subject: "OTP Verification",
            context: {
                recipientName: fname + " "+ lname,
                otpCode: pass
            }
        };
      
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Failed to send email" });
            } else {
              console.log(`Email Sent`);
              return res.status(200).json({ message: "Invite sent successfully" });
            }
          });

          const job = schedule.scheduleJob('5 * * * * *',async(req,res) =>{
            try {
              const expired_otp = await otp.findOne({
                where : {
                  id : save_otp.id,
                  email : email,
                  expiresAt : {
                    [Op.lt] : new Date()
                  }
                }
              })
      
              if(expired_otp){
                await otp.removeAttribute({
                  where : {
                    id : save_otp.id
                  }
                })
      
                await user.removeAttribute({
                  where: {
                    email: email,
                  },
                });
                console.log("Deleted credentials after expiry")
              }
            }
          
            catch (error) {
              console.log(error)
            }
          })



        return res.status(200).json({message : "User created successfully" , user : new_user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}



const super_user_signUp = async (req , res) => {
  const {fname , lname , email , password , mobile_number} = req.body;

  if(!fname || !lname || !email || !password || !mobile_number) {
    return res.status(400).json({message : "Please provide all the details"})
  }

  try {

      const check_invite = await d2uInvite.findOne({
        where : {
            email : email,
        }
      })

      if(!check_invite){
          return res.status(400).json({message : "You are not invited "})
      }

      const check_user = await user.findOne({
        where : {
          email : email,
        }
      })
      if(!check_user){
      }


      const hashed_password = await bcrypt.hash(password , 10)

      const new_user = await user.create({
          fname :fname,
          lname : lname,
          email : email,
          password : hashed_password,
          mobile_number : mobile_number,
          status : true
      })

      const pass = otp_generator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
      const expiresAt = new Date(Date.now() + 1 * 60 * 1000).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      const save_otp = await otp.create({
          otp : pass,
          email : email,
          expiresAt : expiresAt
      })

      const mailOptions = {
          from: process.env.SEND_EMAILID,
          template: "verify_email",
          to: email,
          subject: "OTP Verification",
          context: {
              recipientName: fname + " "+ lname,
              otpCode: pass
          }
      };
    
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to send email" });
          } else {
            console.log(`Email Sent`);
            return res.status(200).json({ message: "Invite sent successfully" });
          }
        });

        const job = schedule.scheduleJob('5 * * * * *',async(req,res) =>{
          try {
            const expired_otp = await otp.findOne({
              where : {
                id : save_otp.id,
                email : email,
                expiresAt : {
                  [Op.lt] : new Date()
                }
              }
            })

            if(expired_otp){
              await otp.removeAttribute({
                where : {
                  id : save_otp.id
                }
              })

              await user.removeAttribute({
                where: {
                  email: email,
                },
              });
              console.log("Deleted credentials after expiry")
            }
          }
        
          catch (error) {
            console.log(error)
          }
        })



      return res.status(200).json({message : "User created successfully" , user : new_user})
  } catch (error) {
      console.log(error)
      return res.status(500).json({message : "Internal server error"})
  }
}




const login = async (req , res) => {
    const {email , password} = req.body;

    try {
        const check_user = await user.findOne({
            where : {
                email : email,
            }
        })

        if(!check_user) {
            return res.status(404).json({message : "User not found"})
        }

        const hashed_password = await bcrypt.compare(password , check_user.password)

        if(!hashed_password) {
            return res.status(400).json({message : "Invalid password"})
        }
        console.log("login successful");

        token = generate_token(check_user)

        res.send(token)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {
    signUp,
    login,
    super_user_signUp
}