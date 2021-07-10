const { Bell } = require('../models/bell');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');
const express = require('express');
const router = express.Router();

router.get('/', isAuthenticated, async(req, res) => {
    const listOfBells = [];
    const bells = await Bell.find({});

    for (const bell of bells) {
        console.log(bell.label);

        listOfBells.push({
            id: bell._id,
            label: bell.label,
            bellOfDay: bell.bellOfDay
        })
    }

    const totalPagesCount = Math.ceil(listOfBells.length / req.query.PageSize);
    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = listOfBells.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    res.status(200).json({
        success: true,
        message: "list of bells",
        data: {
            list: trimmedList,
            pageSize: parseInt(req.query.PageSize),
            page: parseInt(req.query.Page),
            totalPages: totalPagesCount
        }
    })
});

router.get("/:id", isAuthenticated, async (req, res) => {

    const bell = await Bell.findById(req.params["id"]);
    if (!bell) {
        return res.status(404).json({
            success: false,
            message: "Bell doesnt exist."
        })
    }

    res.status(200).json({
        success: true,
        message: "Bell returned successfully.",
        data: {
            label: bell.label,
            bellOfDay: bell.bellOfDay,
            id: bell._id
        }
    })
});

router.post("/", isAuthenticated, isAdmin, async (req, res) => {

    let bellOfDay = await Bell.findOne({bellOfDay: req.body.bellOfDay} );

    if (bellOfDay) {
        return res.status(400).json({
            success: false,
            message: "Bell already exist."
        });
    }

    let bell = new Bell({
        label: req.body.label,
        bellOfDay: req.body.bellOfDay
    });

    await bell.save();

    res.status(200).json({
        success: true,
        message: "Bell created successfully.",
        data: {
            label: req.body.label,
            bellOfDay: req.body.bellOfDay,
            id: bell._id
        }
    });
});

/* TODO : Breaks if the given input (number) is String */

router.put("/:id", isAuthenticated, isAdmin, async(req, res) => {

    const bell = await Bell.findById(req.params["id"]);

    if (!bell) {
        return res.status(400).json({
            success: false,
            message: "Bell does not exist."
        })
    }

    bell.label = req.body.label;
    bell.bellOfDay = req.body.bellOfDay;

    await bell.save();

    res.status(200).json({
        success: true,
        message: "Bell updated successfully.",
        data: {
            label: bell.label,
            bellOfDay: bell.bellOfDay
        }
    });
});

router.delete("/:id", isAuthenticated, isAdmin, async(req, res) => {
    const deletedBell = await Bell.findOneAndDelete({ _id: req.params["id"] });
    if (!deletedBell) {
        return res.status(400).json({
            success: false,
            message: "Bell doesnt exist.",
        })
    }

    res.status(200).json({
        success: true,
        message: "Bell deleted successfully.",
        data: {
            label: deletedBell.label,
            bellOfDay: deletedBell.bellOfDay
        }
    });
});

module.exports = router;