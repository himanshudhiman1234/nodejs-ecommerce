const jwt = require("jsonwebtoken")


const authenticateToken = (req,res,next) =>{
    const token  = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Access  denied not token"})
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.json(403).json({message:"Invalid TOken"})
        }
        req.user = decoded;
        next();
    })
}

module.exports = authenticateToken