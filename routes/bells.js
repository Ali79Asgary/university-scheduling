const { Bell } = require('../models/bell')
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const express = require("express");
const router = express.Router();

/*
    /api/Bells
*/
router.get("/", isAuthenticated, isAdmin, async (req, res) => {

    const listOfBells = [];

    for await (const doc of Bell.find()) {
        listOfBells.push({
            id: doc._id,
            label: doc.label,
            bellOfDay: doc.bellOfDay
        })
      }

    const totalNumberOfPages = Math.ceil(listOfBells.length / req.query.pageSize);

    res.status(200).json(
    {
        list: listOfBells,
        pageSize: req.query.PageSize,
        page: req.query.Page,
        totalPages: totalNumberOfPages
    });
});


router.post("/", isAuthenticated, isAdmin, async (req, res) => {

    const bell = new Bell({
        label: req.body.label,
        bellOfDay: req.body.bellOfDay
    })
    
    await bell.save();

    res.status(200).json(
    {
        id: bell._id,
        label: bell.label,
        bellOfDay: bell.bellOfDay
    });
});

router.get("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const bell = await Bell.findOne({ _id: req.params["id"] });

    if (!bell)
        return res.status(404).json({
            success: false,
            message: "Bell not found.",
        });
    
    res.status(200).json(
        {
            id: bell._id,
            label: bell.label,
            bellOfDay: bell.bellOfDay

        });
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const bell = await Bell.findOne({ _id: req.params["id"] });

    if (!bell)
        return res.status(404).json({
            success: false,
            message: "Bell not found.",
        });

    bell.label = req.body.label;
    bell.bellOfDay =  req.body.bellOfDay;

    await bell.save();

    res.status(200).json(
        {
            success: true,
            message: "Bell updated successfully.",
            data: {
                id: bell._id,
                label: bell.label,
                bellOfDay: bell.bellOfDay
            }
        });
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const bell = await Bell.findOneAndDelete({ _id: req.params["id"] });

    if (!bell)
        return res.status(404).json({
            success: false,
            message: "Bell not found.",
        });
    
    res.status(200).json({
        success: true,
        message: "Bell deleted successfully.",
        data: {
            id: bell._id,
            label: bell.label,
            bellOfDay: bell.bellOfDay
        }
    })
});


module.exports = router;
