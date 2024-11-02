const express = require("express")
const router = express.Router();




router.get('/show-users',(req,res)=>{
    req.render("admin/user")
})



module.exports=router