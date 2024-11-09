const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const connectDB = require('./config/db');


require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Admin Routes
const dashboardRoute = require('./routes/admin/dashboard');
const productRoute = require('./routes/admin/products');
const categoryRoute = require('./routes/admin/category');
const userRoute  = require('./routes/admin/users')
const subcategory =  require('./routes/admin/subcategory')


//frontend

const homeController = require('./routes/home')

const cookieParser = require("cookie-parser");

const {authenticateToken,isAdmin} = require("./middleware/authenticate")
// Connect to the database
connectDB();

// Import Controllers
const { register, login } = require('./controller/register');
const {index,productDetail,getContact} = require('./controller/homeController')
// Middleware
app.use(cookieParser());
app.use(express.static('public')); // Serves static files from 'public' directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(expressLayout);
app.set('view engine', 'ejs');



// Dynamic Layout Selection Middleware
app.use((req, res, next) => {
    if (req.path.startsWith('/admin')) {
        req.app.set('layout', './layout/admin');
    } else if (req.path.startsWith('/user')) {
        req.app.set('layout', './layout/user');
    }else if(req.path.startsWith("/login")){
        req.app.set('layout', './layout/login');
    } 
    else {
        req.app.set('layout', './layout/main');
    }
    next();
});

// Routes
app.use('/admin',authenticateToken,isAdmin, dashboardRoute);
app.use('/admin',authenticateToken, isAdmin,productRoute);
app.use('/admin',authenticateToken,isAdmin, categoryRoute);
app.use('/admin',authenticateToken,isAdmin,userRoute)
app.use('/admin',authenticateToken,isAdmin,subcategory)

//frontend
app.use('/',homeController)

app.post('/register', register);
app.post('/login', login);
app.get("/login",(req, res) => {
    res.render("login");
});

app.get("/",index)
app.get("/product/:id",productDetail)
app.get("/contact",getContact)
app.post("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
    })
    res.redirect("/login")
})

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}`);
});
