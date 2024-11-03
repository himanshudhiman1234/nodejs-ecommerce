const Subcategory = require("../../models/subcategory")
const Category = require("../../models/category")


const subcategory = async(req,res) =>{

    const categories = await Category.find();
    res.render("admin/subcategory/subcategory",{categories})
}




const addSubCategory = async (req, res) => {
    const { name, description, status, category } = req.body;
    
    try {
        const categoryData = await Category.findById(category);
        if (!categoryData) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Create new subcategory
        const newSubcategory = new Subcategory({
            name,
            description,
            status,
            category: categoryData._id
        });

        await newSubcategory.save();
        res.redirect('/admin/show-subcategory');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating subcategory' });
    }
};



const showSubCategory = async(req,res)=>{
    const subCategory =  await Subcategory.find();
    res.render("admin/subcategory/showsubcategory",{subCategory})

}

const editSubCategory = async(req,res)=>{
    const subCategoryId = req.params.id;

    const subcategory = await Subcategory.findById(subCategoryId).populate('category')

    const categories = await Category.find();

    res.render("admin/subcategory/editsubcategory",{subcategory,categories})
}


const updateSubCategory = async (req, res) => {
    const subcategoryId = req.params.id;
    const { name, description, status, category } = req.body; // Retrieve fields from the form
    console.log(name, description, status, category )
    try {
        // Find subcategory by ID and update with new values
        await Subcategory.findByIdAndUpdate(subcategoryId, {
            name,
            description,
            status,
            category,
        });

        // Redirect to the subcategory listing page or show success message
        res.redirect('/admin/show-subcategory');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating subcategory");
    }
};


const deleteSubCategory = async (req, res) => {
    const subcategoryId = req.params.id; // Changed variable name to subcategoryId

    try {
        await Subcategory.findByIdAndDelete(subcategoryId); // Directly calling findByIdAndDelete on the model
        res.redirect('/admin/show-subcategory'); // Redirect to the subcategory listing page after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting subcategory");
    }
};


module.exports = {addSubCategory,subcategory,showSubCategory,editSubCategory,updateSubCategory,deleteSubCategory}