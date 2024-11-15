const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      
      totalPrice: { 
        type: Number, 
        required: true 
      },
    },
  ],
  shippingDetails: {
    address: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
},
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


orderSchema.pre('save', function (next) {
  // If totalAmount already includes shipping, do not overwrite it
  const itemsTotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Add shipping explicitly if not already included
  if (this.totalAmount !== itemsTotal) {
    this.totalAmount = itemsTotal + 10; // Replace 10 with dynamic shipping if needed
  }

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
