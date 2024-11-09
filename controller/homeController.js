const category = require("../models/category");
const Category = require("../models/category");
const Product = require("../models/products");
const Order = require("../models/order")
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
        const relatedProduct = await Product.find({
            category:products.category,
            _id:{$ne:products._id}

        }).limit(4);
       
        return res.render("frontend/productDetail",{products,categories,relatedProduct})
    }catch(error){
        console.log(error)
    }
} 


const getContact = async(req,res) => {
    const categories = await Category.find();
    return res.render("frontend/contact",{categories})
}

const shop = async(req,res) =>{
   
   
    const { name, price, color, size } = req.query; // Get the search query from the URL parameters
let query = {};

if (name) {
    // If there is a search query, perform a case-insensitive search
    query.name = { $regex: name, $options: 'i' };
} 

if (price) {
    const priceRange = price.split('-');
    query.price = { $gte: Number(priceRange[0]), $lte: Number(priceRange[1]) };
}

const products = await Product.find(query); // Pass the query to Product.find()

    return res.render("frontend/shop",{products})
}

const addToCart = async(req,res) =>{
    try{
        const productId = req.params.id;
        const quantity = parseInt(req.query.quantity) || 1;
        const product = await Product.findById(productId)

        
        if(!product){
            return res.status(404).send("Product not found")
        }
        let cart = req.cookies.cart?JSON.parse(req.cookies.cart) : [];
        
        let productIndex = cart.findIndex(item => item.productId === productId);

        if(productIndex !== -1){
            cart[productIndex].quantity +=quantity;
        }else{
            cart.push({
                productId:product._id,
                name:product.name,
                price:product.price,
                quantity:quantity
            })
        }

        res.cookie('cart',JSON.stringify(cart),{httpOnly:true});
        res.redirect('/cart')
        console.log(product)
    }catch(error){
        console.log(error)
    }


   
}
const cart = async(req,res)=>{
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    let ship =10;
    res.render("frontend/cart",{cart,ship})
}

const getCheckout = async (req, res) => {
    let checkout = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
 
    // Ensure that checkout is always an array
    if (!Array.isArray(checkout)) {
        checkout = [];
    }

    // Calculate subtotal
    let subtotal = 0;
    checkout.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = 10; // Example shipping cost
    const total = subtotal + shipping;

    res.render("frontend/checkout", {
        checkout,       // Pass the cart items as checkout
        subtotal,       // Pass subtotal
        shipping,       // Pass shipping cost
        total           // Pass total cost
    });
};



const placeOrder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    console.log("Request body:", req.user.id);

    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    let subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 10;
    const totalAmount = subtotal + shipping;
    const price = subtotal;
    const newOrder = new Order({
        totalAmount,
        shippingDetails: {
            country: req.body.country,
            postalCode: req.body.postalCode,
            city: req.body.city,
            address: req.body.address
        },
        userId: req.user.id,
        status: "processing",
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
        }))
    });

    await newOrder.save();
    res.redirect('/order/confirmation');
};

module.exports = {index,productDetail,getContact,shop,addToCart,cart,getCheckout,placeOrder}