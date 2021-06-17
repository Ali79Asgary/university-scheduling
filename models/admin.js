const mongoose = require("mongoose");
const {userSchema} = require('./user');

const adminSchema = new mongoose.Schema({
    user: {
        type: userSchema,
        required: true
    },
});

const Admin = mongoose.model("Admin", adminSchema);


exports.Admin = Admin;
exports.adminSchema = adminSchema;
