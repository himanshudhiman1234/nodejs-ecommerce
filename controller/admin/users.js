const User = require("../../models/user")


const showUser = async(req,res)=>{

    const users = await User.find();

    res.render("admin/users/showuser",{users})
}
module.exports = showUser