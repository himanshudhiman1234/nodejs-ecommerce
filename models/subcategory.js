const { default: mongoose } = require("mongoose")
const moongoose = require("mongoose")


const subCategorySchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true

    }
},{timestamps:true})

const Subcategory =   mongoose.model("subcategory",subCategorySchema)

module.exports = Subcategory