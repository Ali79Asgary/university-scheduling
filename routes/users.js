const {User, validate} = require("../models/user");
const {Student} = require("../models/student");
const {Admin} = require("../models/admin");
const {Master} = require("../models/master");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

/*
    /api/users
*/
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
    const criteria = {
        $or: [
            {firstName: {$regex: `${req.query['search']}`, $options: "i"}},
            {lastName: {$regex: `${req.query['search']}`, $options: "i"}},
        ],
    };

    const foundUsers = await User.find(criteria);

    if (foundUsers.length === 0)
        return res.status(404).json({
            success: false,
            message: "Users doesnt exist.",
        });


    const response = [];

    for (const foundUser of foundUsers)
        response.push({
            code: foundUser._doc.code,
            id: foundUser._doc._id,
            firstName: foundUser._doc.firstName,
            lastName: foundUser._doc.lastName,
            role: foundUser._doc.role
        });

    const totalNumberOfPages = Math.ceil(response.length / req.query.PageSize);

    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = response.slice(startIndex, startIndex + parseInt(req.query.PageSize));


    res.status(200).json({
        success: true,
        message: "Users returned successfully.",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            Page: req.query['Page'],
            totalPages: totalNumberOfPages
        }

    });

});

router.get("/profile", isAuthenticated, async (req, res) => {
    const foundUser = await User.findById(req.user._id);

    if (!foundUser)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    res.status(200).json({
        success: true,
        message: "User profile returned successfully.",
        data: {
            code: foundUser.code,
            id: foundUser._id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            role: foundUser.role,
        },
    });
});

router.post("/profile", isAuthenticated, async (req, res) => {
    const foundUser = await User.findById(req.user._id);

    if (!foundUser)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    foundUser.firstName = req.body.firstName;
    foundUser.lastName = req.body.lastName;

    res.status(200).json({
        success: true,
        message: "Information are updated successfully.",
        data: {
            code: foundUser.code,
            id: foundUser._id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            role: foundUser.role,
        },
    });
});

router.post("/profile/ChangePassword", isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    const validPassword = await bcrypt.compare(
        req.body["currentPassword"],
        user.password
    );

    if (!validPassword)
        return res.status(400).json({
            success: false,
            message: "User password doesnt match the entered current password.",
        });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body["newPassword"], salt);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password is changed successfully.",
        data: {
            code: user.code,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });
});

router.get("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const user = await User.findOne({_id: req.params["id"]});

    if (!user)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    res.status(200).json({
        success: true,
        message: "User returned successfully.",
        data: {
            code: user.code,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const user = await User.findOne({_id: req.params["id"]});
    if (!user)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.code = req.body.code;

    await user.save();

    res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: {
            code: user.code,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const deletedUser = await User.findOneAndDelete({_id: req.params["id"]});

    if (!deletedUser)
        return res.status(404).json({
            success: false,
            message: "User doesnt exist.",
        });

    res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        data: {
            id: deletedUser._id,
            firstName: deletedUser.firstName,
            lastName: deletedUser.lastName,
            code: deletedUser.code,
        },
    });
});

router.post("/Add", isAuthenticated, isAdmin, async (req, res) => {
    const {error} = validate(req);
    if (error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

    let user = await User.findOne({code: req.body.code});
    if (user)
        return res.status(400).json({
            success: false,
            message: "User already registered.",
        });

    user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        code: req.body.code,
        role: req.body.role,
        password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    let role_message = "";

    switch (user.role) {
        case "Student":
            const student = new Student({
                user: user._id,
                timeTables: [],
            });
            role_message = "Student";
            await student.save();
            break;

        case "Master":
            const master = new Master({
                user: user._id,
                timeTables: [],
                timeTableBells: [],
                courses: [],
            });
            role_message = "Master";
            await master.save();
            break;

        case "Admin":
            const admin = new Admin({
                user: user._id,
            });
            role_message = "Admin";
            await admin.save();
            break;
    }

    res.status(200).json({
        success: true,
        message: `${role_message} created successfully.`,
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            code: req.body.code,
            role: req.body.role,
            id: user._id,
        },
    });
});

router.post("/AddList", isAuthenticated, isAdmin, async (req, res) => {
    const response = [];
    for (let u of req.body) {
        const {error} = validate(u);
        if (error)
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });

        let user = await User.findOne({code: u.code});
        if (user)
            return res.status(400).json({
                success: false,
                message: "User already registered.",
            });

        user = new User({
            firstName: u.firstName,
            lastName: u.lastName,
            code: u.code,
            role: u.role,
            password: u.password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        switch (user.role) {
            case "Student":
                const student = new Student({
                    user: user._id,
                    timeTables: [],
                });
                await student.save();
                break;

            case "Master":
                const master = new Master({
                    user: user._id,
                    timeTables: [],
                    timeTableBells: [],
                    courses: [],
                });
                await master.save();
                break;

            case "Admin":
                const admin = new Admin({
                    user: user._id,
                });
                await admin.save();
                break;
        }

        response.push({
            firstName: user.firstName,
            lastName: user.lastName,
            code: user.code,
            role: user.role,
            id: user._id,
        });
    }
    res.status(200).json({
        message: "Users are created successfully.",
        success: true,
        data: response,
    });
});

module.exports = router;
