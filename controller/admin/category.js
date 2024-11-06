// const category = require('../../models/category');
const Category = require('../../models/category');

const Postcategory = async (req, res) => {
    try {
        const { name, description, status } = req.body; // Extract fields from req.body
        const categoryImage = req.file.path.replace(/^public[\\/]/, '');
        

        console.log('Name:', name);
        console.log('Description:', description);
        console.log('Status:', status);
        console.log('Category Image:', categoryImage);

        if (!name || !description || !status || !categoryImage) {
            return res.status(401).json({ message: "All fields are required" });
        }

        const categories = new Category({
            name,
            description,
            status,
            image: categoryImage // Use the uploaded file's path
        });

        await categories.save();
        res.redirect('/admin/show-category');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const showCategory = async(req,res)=>{
    try{
        const showCategory = await Category.find();
        
        res.render("admin/category/showcategory",{showCategory})
    }catch(error){
        console.log(error)
    }
}

const editCategory = async(req,res)=>{
    const categoryId = req.params.id;
    const  category = await Category.findById(categoryId);


    if(!category){
        return res.status(404),json('category not found')
    }


    res.render('admin/category/editcategory',{category})
}

const updateCategory = async(req,res) =>{
    const categoryId = req.params.id;

    const {name,description,status} =req.body;
    const updateData = {
        name,
        description,
        status,
    };
    if (req.file) {
        const categoryImage = req.file.path.replace(/^public[\\/]/, '');
        updateData.image = categoryImage; // Add the image path to the update data
    }
    try{
        const updateCategory = await Category.findByIdAndUpdate(
            categoryId,
            {name,description,status,updateData},
            {new:true}
        )

        if(!updateCategory){
            return res.status(404).json({message : "Category not found"})
        }

        res.redirect('/admin/show-category');

    }catch(error){
        console.log(error)
    }
}


const deleteCategory = async(req,res)=>{
    const  categoryId = req.params.id;

    let category = await Category.findByIdAndDelete(categoryId)


    res.redirect('/admin/show-category');
}


module.exports = {Postcategory,showCategory,editCategory,updateCategory,deleteCategory};
