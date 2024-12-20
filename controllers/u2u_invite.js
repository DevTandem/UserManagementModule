const u2u_invite_model = require("../db/models/u2u_invite")
const user_permission_map_model = require("../db/models/user_permission_map")
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
require("dotenv").config()
const { Sequelize, DataTypes } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const u2u_invite = u2u_invite_model(sequelize, DataTypes)
const user_permission_map = user_permission_map_model(sequelize, DataTypes)



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



const u2u_invite_controller = async (req,res) =>{
    const obj = req.user
    const {email} = req.body

    if(!obj) return res.json({message: "No auth found"})
        

    try{
        const permissions = await user_permission_map.findAll({
            where: {
                user_id: obj.id
            }
        })

        const hasCreateUserPermission = permissions.some(permission => permission.p_name === "CREATE_USER");

        if (!hasCreateUserPermission) {
            return res.status(403).json({ message: "You do not have permission to create users" });
        }


        if (!email ) {
            return res.status(400).json({ message: "Provide an email id for invite" });
        }

        const check_u = await u2u_invite.findOne({
            where : {
                email : email
            }
        })
        
        if(check_u){
            return res.status(404).json({message : "This email id is already in use"})
        }

        const inviteEmail = await u2u_invite.create({
            email: email,
            user_id: obj.id,
            warehouse_id: hasCreateUserPermission.warehouse_id >= 0
                ? hasCreateUserPermission.warehouse_id
                : null
        });

        const mailOptions = {
            from: process.env.SEND_EMAILID,
            template: "invite_user",
            to: inviteEmail.email,
            subject: "Invitation to become a user of the organization",
            context: {
                user_signup_link: "http://localhost:5000/main/signIn"
            }
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log(`Email Sent`);
                return res.status(200).json({ message: "Invite sent successfully", inviteEmail });
            }
        });

        console.log(`Invite Created :\n ${inviteEmail}`)


    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {u2u_invite_controller}