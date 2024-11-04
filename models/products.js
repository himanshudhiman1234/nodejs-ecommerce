const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Assuming you have a Category model for product categorization
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    variantColor: {
        type: String,
        required: true,
        trim: true,
    },
    variantSize:{
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Middleware to update `updatedAt` field automatically
  

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
