const User =  require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register =async(req,res) =>{

    const { name,
        email,
        password,
        confirm_password} = req.body;

        
    if(!name,!email,!password,!confirm_password){
        return res.status(400).json({message:"All fields are required"})
    }

    const existingUser = await User.findOne({email})

    if(password !== confirm_password){
        return res.status(400).json({message:"Password and confirm password doesnot match"})
    }


    if(existingUser){
        return res.status(400).json({message : "User already exist"})
    }

    const hashedPassword = await bcrypt.hash(password,10);


    const newUser = new User({
        name,
        email,
        password: hashedPassword,  // Use hashed password
        confirmPassword: confirm_password
    })

    await newUser.save();
    res.status(201).json({message:"User registered Successfully"})
}

const login = async(req,res)=>{
    const {email,password} = req.body;

  if(!email,!password){
    return res.status(400).json({message:"please fill all fields"})
  }
try{

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User name not exist"})
    }
  
    const isMatch = await bcrypt.compare(password,user.password)
  
    if(!isMatch){
      return res.status(400).json({message:"Invalid Credential"})
    }
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },  // Include role in the token payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // Secure in production only
        maxAge: 3600000  // 1 hour
    });

    // Redirect based on role
    if (user.role === "admin") {
        res.redirect("/admin/show-users");
    } else {
        res.redirect("/user");
    }

   
}catch(error){
    console.log(error);
    res.status(500).json({message:"Server error"})
}
}



module.exports = {register,login}