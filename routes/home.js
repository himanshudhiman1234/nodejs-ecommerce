const express = require("express")
const router = express.Router();

const {shop,addToCart,cart,getCheckout,placeOrder} = require("../controller/homeController")
const {authenticateToken,isUser} = require("../middleware/authenticate")
    

router.get('/shop',shop)

router.get('/add-to-cart/:id',addToCart)

router.get('/cart',cart)
router.get('/checkout',getCheckout)
router.post('/orders',authenticateToken, isUser,placeOrder)

module.exports=router