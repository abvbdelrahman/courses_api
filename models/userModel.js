const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail,'must be a valid email'] },
    token: { type: String},
    role: { type: String,
        enum:["USER", "ADMIN", "MANAGER"],
        default: "USER",
        required: true 
    },
    avatar: { type: String, default: "./../uploads/default.jpg" }
});

module.exports = mongoose.model('User', userSchema);