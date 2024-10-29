const express = require("express");
const router = express.Router();

router.get("/admin",async(req,res) =>{
res.render("admin/dashboard")
})

module.exports = router