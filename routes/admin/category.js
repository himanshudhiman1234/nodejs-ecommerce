const express = require("express");
const router = express.Router();

router.get('/category',(req,res)=>{
    res.render("admin/category/category")
})
module.exports = router