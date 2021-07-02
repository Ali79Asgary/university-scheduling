const { Day } = require('../models/day')
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const express = require("express");
const { date } = require('joi');
const router = express.Router();

/*
    /api/Days
*/


router.get("/", isAuthenticated, isAdmin, async (req, res) => {

    const listOfDays = [];

    for await (const doc of Day.find()) {
        listOfDays.push({
            id: doc._id,
            label: doc.label,
            dayOfWeek: doc.dayOfWeek
        })
      }

    const totalNumberOfPages = Math.ceil(listOfDays.length / req.query.pageSize);

    res.status(200).json(
    {
        list: listOfDays,
        pageSize: req.query.pageSize,
        page: req.query.page,
        totalPages: totalNumberOfPages
    });
});


router.post("/", isAuthenticated, isAdmin, async (req, res) => {

    const day = new Day({
        label: req.body.label,
        dayOfWeek: req.body.dayOfWeek
    })
    
    await day.save();

    res.status(200).json(
    {
        id: day._id,
        label: day.label,
        dayOfWeek: day.dayOfWeek
    });
});

router.get("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const day = await Day.findOne({ _id: req.params["id"] });

    if (!day)
        return res.status(404).json({
            success: false,
            message: "Day not found.",
        });
    
    res.status(200).json(
        {
            id: day._id,
            label: day.label,
            dayOfWeek: day.dayOfWeek

        });
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const day = await Day.findOne({ _id: req.params["id"] });

    if (!day)
        return res.status(404).json({
            success: false,
            message: "Day not found.",
        });

    day.label = req.body.label;
    day.dayOfWeek =  req.body.dayOfWeek;

    await day.save();

    res.status(200).json(
        {
            success: true,
            message: "Day updated successfully.",
            data: {
                id: day._id,
                label: day.label,
                dayOfWeek: day.dayOfWeek
            }
        });
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const day = await Day.findOneAndDelete({ _id: req.params["id"] });

    if (!day)
        return res.status(404).json({
            success: false,
            message: "Day not found.",
        });
    
    res.status(200).json({
        success: true,
        message: "Day deleted successfully.",
        data: {
            id: day._id,
            label: day.label,
            dayOfWeek: day.dayOfWeek
        }
    })
});


module.exports = router;
