const express = require("express")
const app = express();
const expressLayout = require("express-ejs-layouts")
const connectDB = require('./config/db')
require('dotenv').config();
const PORT = 5000 || process.env.PORT;

//admin Routes
const dashboardRoute = require('./routes/admin/dashboard')
const productRoute = require('./routes/admin/products')
const categoryRoute = require('./routes/admin/category')

connectDB();

const {register,login}= require('./controller/register')


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
// 
app.use(expressLayout)
// app.set('layout','./layout/main')
app.set('view engine','ejs')

app.use((req, res, next) => {
    if (req.path.startsWith('/admin')) {
        req.app.set('layout', './layout/admin');
    } else if (req.path.startsWith('/user')) {
        req.app.set('layout', './layout/user');
    } else {
        req.app.set('layout', './layout/main');
    }
    next();
});


app.use('/admin',dashboardRoute)
app.use('/admin', productRoute);
app.use('/admin',categoryRoute)

app.post('/register',register)
app.post('/login',login)
app.get("/login",(req,res)=>{
    res.render("login")
})
app.use("/admin",require('./routes/admin/dashboard')) 

app.listen(PORT,()=>{
    console.log(`server is starting`)
})