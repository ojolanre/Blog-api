const express = require("express");
require("dotenv").config() //loads environment variables from .env file
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
const app = express()

const PORT = process.env.PORT || 3000;

// connects to the db
connectDB.connectToMongoDB()


//middleware
app.use(express.json());
app.use('/auth', userRoutes)
app.use('/blogs', blogRoutes)


app.listen(PORT, () => {
    console.log(`Server started on PORT: http://localhost:${PORT}`)
})