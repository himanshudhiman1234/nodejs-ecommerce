const express = require("express")
const router = express.Router();

const showUser = require("../../controller/admin/users")


router.get('/show-users',showUser)



module.exports=router