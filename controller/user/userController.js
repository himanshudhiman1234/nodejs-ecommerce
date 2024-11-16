const Order = require("../../models/order")

const showOrder = async(req,res) =>{
  

    const userId = req.user.id;
    const orders = await Order.find({ userId })
        .populate('userId','name email') // Populating user details
        .populate('items.productId', 'name price'); // Populating product details
    
        
        res.render("user/order",{orders})
}

module.exports = { showOrder}