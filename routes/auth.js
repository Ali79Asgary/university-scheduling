const { User } = require("../models/user");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/Login", async (req, res) => {
    const { error } = validateRequest(req);
    if (error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

    let user = await User.findOne({ code: req.body.code });
    if (!user) return res.status(400).json({
            success: false,
            message: "User doesnt exist.",
        });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) 
        return res.status(400).json({
            success: false,
            message: "Invalid code or password.",
        });

    const generatedToken = user.generateAuthToken();
    res.json({
        token: generatedToken,
        expireAt: jwt.verify(generatedToken, 'wonderland')['iat'],
        user: {
            code: user.code,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role

        }
    });
  
});

function validateRequest(req, res) {
    const schema = Joi.object({
        password: Joi.string().min(4).max(1024).required(),
        code: Joi.string().min(5).max(10).required(),
    });

    return schema.validate(req.body);
}

module.exports = router;
