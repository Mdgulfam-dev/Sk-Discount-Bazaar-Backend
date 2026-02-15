const mongoose = require("mongoose");


const adminUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    
});

module.exports = mongoose.model("AdminUser", adminUserSchema);
