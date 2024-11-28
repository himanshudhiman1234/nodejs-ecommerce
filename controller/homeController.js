const category = require("../models/category");
const Category = require("../models/category");
const Product = require("../models/products");
const Order = require("../models/order")
const User = require("../models/user");

const stripePublicKey = process.env.STRIPE_API_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

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


const getCategory = async(req,res) =>{

    const categoryName = req.params.name;
    // console.log(categoryName)
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });



    res.render("frontend/category",{products})
}

const getContact = async(req,res) => {
    const categories = await Category.find();
    return res.render("frontend/contact",{categories})
}

const shop = async(req,res) =>{
  
   const page =parseInt(req.query.page) || 1;

   const limit = 10;

   const skip = (page -1) *limit;
   const totalItems = await Product.countDocuments(); // Total items
   const totalPages = Math.ceil(totalItems / limit);
    const { name, price, color, size } = req.query; // Get the search query from the URL parameters
        let query = {};

        if (name) {
            // If there is a search query, perform a case-insensitive search
            query.name = { $regex: name, $options: 'i' };
        } 

        if (price) {
            const priceFilters = Array.isArray(price) ? price : [price]; // Ensure it's an array
            const priceConditions = priceFilters.map(range => {
                const [min, max] = range.split('-').map(Number);
                return { price: { $gte: min, $lte: max } };
            });
            query.$or = priceConditions; 
        }

        const products = await Product.find(query).skip().limit(limit); // Pass the query to Product.find()
        
        if(req.xhr){
            return res.render('partials/productList',{products,layout:false})
        }
        
    return res.render("frontend/shop",{products,currentPage: page,totalPages})
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

  
    const shipping = 10;
    const total = subtotal + shipping;

    const totalAmount = Math.round(subtotal + shipping);

    // Ensure totalAmount is valid
    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("Invalid total amount for checkout.");
    }
    // x// });

    // Send client secret and public key to the client for Stripe.js processing
    // res.json({
    //     clientSecret: paymentIntent.client_secret,
    //     stripePublicKey: process.env.STRIPE_API_KEY,
    // });

    res.render("frontend/checkout", {
        checkout,       // Pass the cart items as checkout
        subtotal,       // Pass subtotal
        shipping,       // Pass shipping cost
        total    ,       // Pass total cost
        key: stripePublicKey
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

    console.log("Subtotal:", subtotal, "Shipping:", shipping, "Total Amount before save:", totalAmount);

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
        paymentStatus: "pending", // Initial status
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
        }))
    });

    console.log("New Order:", newOrder);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            ...cart.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100) // Price in cents
                },
                quantity: item.quantity
            })),
            // Add shipping as a separate line item
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping'
                    },
                    unit_amount: Math.round(shipping * 100) // Shipping fee in cents
                },
                quantity: 1 // Only one shipping charge
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order/confirmation?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`
    });

    newOrder.stripeSessionId = session.id;

    // Debugging the totalAmount before saving
    console.log("Final Total Amount before save:", newOrder.totalAmount);

    await newOrder.save();

    // Check the saved order
    const savedOrder = await Order.findById(newOrder._id);
    console.log("Saved Order Total Amount:", savedOrder.totalAmount);

    res.redirect(session.url);
};













module.exports = {index,productDetail,getContact,shop,addToCart,cart,getCheckout,placeOrder,getCategory}