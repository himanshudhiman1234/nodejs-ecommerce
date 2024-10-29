const express = require("express")
const app = express();
const expressLayout = require("express-ejs-layouts")



const PORT = 5000 || process.env.PORT;

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

app.use("/admin",require('./routes/admin/dashboard')) 

app.listen(PORT,()=>{
    console.log(`server is starting`)
})