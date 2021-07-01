const { Day } = require('../models/day')
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const express = require("express");
const router = express.Router();

/*
    /api/Days
*/

/* Needs isAuthenticated, isAdmin */
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

/* Needs isAuthenticated, isAdmin */
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


module.exports = router;
