const express = require("express");
const router = express.Router();

const {Postcategory,showCategory,editCategory,updateCategory,deleteCategory}  = require("../../controller/admin/category")


const upload = require("../../middleware/multerConfig")

router.get('/category',(req,res)=>{
    res.render("admin/category/category")
})
router.post('/submit-category',upload.single('categoryimage'),Postcategory)
router.get('/show-category',showCategory)
router.get('/edit-category/:id',editCategory)
router.post('/update-category/:id',upload.single('categoryimage'),updateCategory)
router.post('/delete-category/:id',deleteCategory)
module.exports = router