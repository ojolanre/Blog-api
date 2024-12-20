 // src/controllers/userController.js
 const User = require('../models/userModel');
 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt')

const signup = async (req, res) => {
   try {
     const { first_name, last_name, email, password } = req.body;

     // Check if email already exists
     const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
     }
     const user = new User({
        first_name,
        last_name,
        email,
        password
      });
     await user.save();

     res.status(201).json({ message: 'User created successfully' });
     } catch (error) {
        res.status(500).json({ message: 'Error signing up', error: error.message });
      }
   };
  const signin = async (req, res) => {
 try {
     const { email, password } = req.body;
     // Check if user exists
     const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
       }
       // Check password
       const isMatch = await user.comparePassword(password)
         if (!isMatch) {
           return res.status(401).json({ message: 'Invalid credentials' });
       }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
       expiresIn: '1h',
     });
 res.status(200).json({ message: 'Logged in successfully', token });
     } catch (error) {
     res.status(500).json({ message: 'Error signing in', error: error.message });
   }
   };
module.exports = { signup, signin };