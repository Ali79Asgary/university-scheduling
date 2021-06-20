const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Admin = mongoose.model("Admin", adminSchema);


exports.Admin = Admin;
exports.adminSchema = adminSchema;
