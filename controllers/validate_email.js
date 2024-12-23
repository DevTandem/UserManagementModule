require("dotenv").config()
const { Sequelize, DataTypes, Op, or } = require('sequelize');
const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl);
const UserModel = require("../db/models/user");
const user = UserModel(sequelize, DataTypes)
const {reset_token} = require("../utils/generateToken");
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')


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


const validate_email = async(req,res) => {
    const {email} = req.body

    try {
        const check_email = await user.findOne({
            where : {
                email : email
            }
        })
        
        if(!check_email){
            return res.status(404).json({message : "Email id not found"})
        }

        r_token = reset_token(check_email)
        if (!r_token) {
            return res.status(400).json({ message: "Token not generated" });
        }
      
        
        console.log(r_token)

        const mailOptions = {
            from: process.env.SEND_EMAILID,
            template : "forgot_password",
            to: check_email.email,
            subject: "Reset Password",
            context: {
                name: check_email.fname+" "+check_email.lname,
                resetLink: `http://localhost:5000/main/signIn/reset_password/${r_token}`,
            }
            // html: '<h1>Click on </h1><a href = "http://localhost:5000/main/user_signIn/reset_password/'+r_token+'">Reset password</a>'
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log(`Email Sent`);
                return res.status(200).json({ message: "Invite sent successfully" });
            }
        });
        return res.send({
            data : r_token})
        // return res.status(200).json({message : "email validation success"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500, 
            message : "Internal server error",
            data: null,        
            error: error,       
            success: false      
        });
    }
}

module.exports = {
    validate_email
}