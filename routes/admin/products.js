const express = require("express")
const router =  express.Router();
const Categories = require("../../models/category")

const {submitProduct,getProduct,getProductData,updateProduct,deleteProductData} = require("../../controller/admin/product")
const upload = require("../../middleware/multerConfig")

router.get("/product",async (req,res)=>{
    const categories = await Categories.find();
    res.render("admin/products/products",{categories})
})
router.post('/submit-product', upload.array('images'), submitProduct);

router.get("/show-product",getProduct)

router.get("/edit-product/:id",getProductData)
router.post("/update-product/:id",upload.array('images'),updateProduct)

router.post("/delete-product/:id",deleteProductData)
module.exports = router