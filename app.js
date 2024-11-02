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

// Connect to the database
connectDB();

// Import Controllers
const { register, login } = require('./controller/register');

// Middleware
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
    } else {
        req.app.set('layout', './layout/main');
    }
    next();
});

// Routes
app.use('/admin', dashboardRoute);
app.use('/admin', productRoute);
app.use('/admin', categoryRoute);

app.post('/register', register);
app.post('/login', login);
app.get("/login", (req, res) => {
    res.render("login");
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}`);
});
