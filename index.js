const express = require("express");
require("dotenv").config() //loads environment variables from .env file
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
const app = express()
const path = require('path')
const Blog = require('./models/blogModel')

const PORT = process.env.PORT || 3000;

// connects to the db
connectDB.connectToMongoDB()


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/auth', userRoutes)
app.use('/blogs', blogRoutes)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1] //get token
        let user;
        if (token) {
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                user = decoded
            } catch(err){
            }
        }
        console.log("Fetching published blogs...");
        //get all the published blogs
        const blogs = await Blog.find({state: 'published'}).populate({
            path: 'author',
            select: 'first_name last_name email',
        });
        console.log('Fetched blogs:', blogs);
        res.render('index', { blogs, user})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Error", error: error.message})
    }
})

app.listen(PORT, () => {
    console.log(`Server started on PORT: http://localhost:${PORT}`)
})