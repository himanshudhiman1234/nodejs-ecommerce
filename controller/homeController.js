const Category = require("../models/category");
const Product = require("../models/products");

const index = async(req,res) =>{
    const categories = await Category.find();

    const products = await Product.find().sort({createdAt : -1}).limit(6);
    const justarriving = await Product.find().sort({createdAt : -1}).limit(6);
   
    
res.render("frontend/index",{categories,products,justarriving})
}


const productDetail = async(req,res) =>{
    try{
        const categories = await Category.find();
        const productId = req.params.id;
        
        const products = await Product.findById(productId);
        
        return res.render("frontend/productDetail",{products,categories})
    }catch(error){
        console.log(error)
    }
} 

module.exports = {index,productDetail}