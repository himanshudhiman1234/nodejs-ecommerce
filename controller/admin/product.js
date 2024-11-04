const Product = require("../../models/products");
const category = require("../../models/category")

const fs = require('fs');
const path = require('path');


const submitProduct = async (req, res) => {
    try {
        const { name, description, price, category, status, totalQuantity, variantColor, variantSize } = req.body;
        
        // Collect image paths from uploaded files
        const imagePaths = req.files.map(file => file.path.replace(/^public[\\/]/, ''));

        // Create a new product with the collected image paths
        const product = new Product({
            name,
            description,
            price,
            category,
            status,
            stock: totalQuantity,
            images: imagePaths,
            variantColor:variantColor,
            variantSize:variantSize
        });

        console.log('Product to be saved:', product); // Check the product structure
        
        await product.save();
        res.redirect('/admin/show-product');
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).send('Server Error');
    }
};


const getProduct = async(req,res) =>{
    const products = await Product.find().populate('category');

    res.render("admin/products/showProduct",{products})
}
const getProductData = async(req,res) =>{
    const product = req.params.id;
    const products = await Product.findById(product);
    const categories = await category.find();
    res.render("admin/products/editProduct",{products,categories})
}


const updateProduct = async (req, res) => {
    const productId = req.params.id;

    const { name, description, price, category, status, totalQuantity, variantColor, variantSize } = req.body;
    const newImages = req.files.map(file => file.path.replace(/^public[\\/]/, '')); // Get new images' paths

    try {
        // Fetch the existing product to get the old images
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Optionally delete old images from the filesystem
        if (existingProduct.images.length > 0) {
            existingProduct.images.forEach(oldImage => {
                const filePath = path.join(__dirname, '..', oldImage); // Construct the file path
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${filePath}`, err);
                    }
                });
            });
        }

        // Update the product with new data and replace images
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                category,
                status,
                totalQuantity,
                images: newImages, // Replace with new images
                variantColor,
                variantSize
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.redirect('/admin/show-product');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while updating the product." });
    }
};




const deleteProductData = async(req,res)=>{
    const ProductId = req.params.id;

    const products = await Product.findByIdAndDelete(ProductId)

    res.redirect("/admin/show-product")
}
module.exports = {submitProduct,getProduct,getProductData,deleteProductData,updateProduct};
