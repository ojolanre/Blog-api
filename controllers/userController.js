const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Blog = require('../models/blogModel');

const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('signup', { error: 'Email already in use' });
        }
        const user = new User({
            first_name,
             last_name,
             email,
             password
            });
         await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
           });
           res.cookie('token', token, { httpOnly: true });
       const blogs = await Blog.find({state: 'published'}).populate({
             path: 'author',
             select: 'first_name last_name email',
           });
         res.render('index', { message: "User created successfully", blogs, user, token});
        } catch (error) {
       // Log the error for debugging purposes
       console.error("Error in signup:", error);
        return res.status(500).render('signup', { error: 'Error signing up', error: error.message });
         }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
          if (!user) {
             return res.status(401).render('signin', {error: "Invalid credentials"});
          }
       // Check password
         const isMatch = await user.comparePassword(password)
           if (!isMatch) {
              return res.status(401).render('signin', { error: "Invalid credentials" });
             }
         // Generate JWT token
       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
             expiresIn: '1h',
           });
           res.cookie('token', token, { httpOnly: true });
       const blogs = await Blog.find({state: 'published'}).populate({
           path: 'author',
            select: 'first_name last_name email',
          });
         res.render('index', { blogs, user, token});
         } catch (error) {
             // Log the error for debugging purposes
          console.error("Error in signin:", error);
            return res.status(500).render('signin', { error: 'Error signing in', error: error.message });
         }
  };
module.exports = { signup, signin };