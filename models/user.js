const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{type: String, lowercase: true , trim: true},
    password:{type: String },
    token:{type: String, trim: true},
    created_at: { type: Number, default: ()=>Date.now() },
    updated_at: { type: Number, default: ()=>Date.now() }

});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;