const Category = require('../../models/category')


const category = async(req,res)=>{
    try{
            const {name,description,status,categoryimage} = req.body;
            if(!name,!description,!status,!categoryimage){
                return res.status(401).json({message:"All fields are required"})
            }

            const category =  new Category({
                name,description,status,image 
            })

            console.log(category)

    }catch(error){
        console.log(error)
    }
}