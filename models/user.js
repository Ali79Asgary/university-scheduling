const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 255
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 255
    },
    code: {
        type: String,
        maxlength: 10,
        minlength: 5,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true
    },
    rule: {
        type: String,
        enum: ['Master', 'Admin', 'Student'],
        required: true
    },
});

// adding generateAuthToken function for creating JWT token.
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, rule: this.rule}, 'wonderland');
    return token;
}

// creating new model
const User = mongoose.model("User", userSchema);

// function for validating user objects
function validateUser(req, res) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(255).required(),
      lastName: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(6).max(1024).required(),
      code: Joi.string().min(5).max(10).required(),
      rule: Joi.string().valid("Master", "Admin", "Student").required()
    });

    return schema.validate(req.body);
} 

exports.User = User
exports.validate = validateUser
exports.userSchema = userSchema
