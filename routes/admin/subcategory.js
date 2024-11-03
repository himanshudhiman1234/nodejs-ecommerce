const express = require("express")
const router =  express.Router();
const {subcategory,addSubCategory,showSubCategory,editSubCategory,updateSubCategory,deleteSubCategory} = require("../../controller/admin/subcategory")

router.get("/subcategory",subcategory)
router.post("/submit-subcategory",addSubCategory)
router.get("/show-subcategory",showSubCategory)
router.get("/edit-subcategory/:id",editSubCategory)
router.post("/update-subcategory/:id",updateSubCategory)
router.post("/delete-subcategory/:id",deleteSubCategory)
module.exports = router