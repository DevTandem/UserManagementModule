const express = require("express");
const { client } = require("./config/db");

const app = express();

const user_router = require("./routes/user")
const developer_router = require("./routes/developer")
const assign_admin = require("./routes/assign_admin")
const d2u_invites = require("./routes/d2u_invite")
const u2u_invites = require("./routes/u2u_invite")
const deactivate_user = require("./routes/deactivate_user")
const manage_user = require("./routes/manage_user")
const organization = require("./routes/organization")
const warehouse = require("./routes/warehouse")
const resource = require("./routes/resource")
const user_group = require("./routes/user_group")
const update_resource = require("./routes/update_resource");
const verify_otp = require("./routes/verify_otp");
const u2ug_map = require("./routes/u2ug_map");
const ma_router = require("./routes/manage_access");
const forgot_pass = require("./routes/forgot_password");
const validate_email = require("./routes/validate_email");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/main" , user_router)
app.use("/main",developer_router)
app.use("/main",assign_admin)
app.use("/main",d2u_invites)
app.use("/main",u2u_invites)
app.use("/main",warehouse)
app.use("/main",user_group)
app.use("/main",organization)
app.use("/main",update_resource)
app.use("/main",resource)
app.use("/main",deactivate_user)
app.use("/main",manage_user)
app.use("/main",verify_otp)
app.use("/main",u2ug_map)
app.use("/main",ma_router)
app.use("/main",forgot_pass)
app.use("/main",validate_email)

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

client.connect().then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
});