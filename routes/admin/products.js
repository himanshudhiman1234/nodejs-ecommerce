const express = require("express")
const router =  express.Router();

router.get("/product",(req,res)=>{
    res.render("admin/products/products")
})
module.exports = router