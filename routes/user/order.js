const express = require("express")
const router = express.Router();

const {showOrder} = require("../../controller/user/userController")

router.get('/order',showOrder)


module.exports=router