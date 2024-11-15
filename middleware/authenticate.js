const jwt = require("jsonwebtoken")


const authenticateToken = (req,res,next) =>{
    const token  = req.cookies.token;

    if(!token){
        return  res.redirect('/login'); 
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return  res.redirect('/login'); 
        }
        req.user = decoded;
        next();
    })
}


const isAdmin =(req,res,next) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access denied. Admins only"})
    }
    next();
}


const isUser = (req, res, next) => {
    console.log(req.user.role)
    if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied. Users only." });
    }
    next();
};

module.exports = {authenticateToken,isAdmin,isUser}