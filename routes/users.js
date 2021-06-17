const {User, validate} = require('../models/user');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/Add', isAuthenticated, isAdmin, async (req, res) => {
    const { error } = validate(req);
    if (error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });

    let user = await User.findOne({ code: req.body.code});
    if (user) return res.status(400).json({
        success: false,
        message: 'User already registered.'
    });

    user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        code: req.body.code,
        rule: req.body.rule,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).json({
        success: true,
        message: "User created successfully.",
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            code: req.body.code,
            rule: req.body.rule,
            id: user._id.toString()
        }
    });

});


router.post('/AddList', isAuthenticated, isAdmin, async (req, res) => {

    const response = [];
    for (let u of req.body) {
        const {error} = validate(u);
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message
        });

        let user = await User.findOne({code: u.code});
        if (user) return res.status(400).json({
            success: false,
            message: 'User already registered.'
        });

        user = new User({
            firstName: u.firstName,
            lastName: u.lastName,
            code: u.code,
            rule: u.rule,
            password: u.password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        response.push({
            firstName: user.firstName,
            lastName: user.lastName,
            code: user.code,
            rule: user.rule,
            id: user._id
        });
    }
    res.json({
        message: 'Users are created successfully.',
        success: true,
        data: response
    });

});

 module.exports = router;