const express = require("express")
const router = express.Router();

const {shop,addToCart,cart,getCheckout,placeOrder, getCategory} = require("../controller/homeController")
const {authenticateToken,isUser} = require("../middleware/authenticate")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/order")

router.get('/shop',shop)

router.get('/add-to-cart/:id',addToCart)

router.get('/products/category/:name',getCategory)

router.get('/cart',cart)
router.get('/checkout',getCheckout)
router.post('/orders',authenticateToken, isUser,placeOrder)

router.get('/order/confirmation', async (req, res) => {
    const { session_id, orderId } = req.query;

    if (!session_id || !orderId) {
        return res.status(400).send("Missing session_id or orderId");
    }

    try {
        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Fetch the order from the database using the orderId
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Update the paymentStatus field based on Stripe's payment_status
        if (session.payment_status === 'paid') {
            order.paymentStatus = 'completed'; // Use paymentStatus for Stripe's status
            order.status = 'processing'; // Keep status aligned with order fulfillment
        } else if (session.payment_status === 'unpaid') {
            order.paymentStatus = 'failed';
        } else if (session.payment_status === 'pending') {
            order.paymentStatus = 'pending';
        }

        await order.save(); // Save the updated order

        res.render('frontend/paymentStatus', { status: order.paymentStatus }); // Render payment status page
    } catch (error) {
        console.error("Error retrieving session or updating order:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports=router