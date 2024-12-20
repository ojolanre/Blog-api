// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {timestamps: true});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try{
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt)
    }catch(err){
       return next(err)
    }
    next()
 });

//compare the passwords to check if they match during login
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
 }
const User = mongoose.model('User', userSchema);

module.exports = User;