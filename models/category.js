const mongoose = require("mongoose")

const categorySchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
       enum : ['active','inactive'],
       default:'active'
    },
    image:{
        type:String
    }
})

categorySchema.virtual('subcategories',{
    ref:'Subcategory',
    localField:'_id',
    foreignField:'category'
})

module.exports = mongoose.model('Category',categorySchema)
