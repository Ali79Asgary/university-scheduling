const { Day } = require('../models/day')
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const router = require("express").Router();
const config = require('../config/development-config.json')

/*
    /api/Days
    
    TODO : Pagination process is weekly implemented, needs reimplementation, it works though
    TODO : Request parameter validation (almost all requests. need to check)
    TODO : POST, Details explained in the function, please scroll down
    TODO : POST, Check for null parameters
        TIP : Might be possible through implementing schema validate function in the model object
*/

/* /api/Days/ */
router.get("/", isAuthenticated, async (req, res) => {

    const listOfDays = []; 

    for await (const doc of Day.find()) {
        listOfDays.push({
            id: doc._id,
            label: doc.label,
            dayOfWeek: doc.dayOfWeek
        })
      }

    const totalNumberOfPages = Math.ceil(listOfDays.length / req.query.PageSize); 

    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = listOfDays.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    res.status(config.HTTP.OK).json(
    {  
        success : true,
        message: "list of days",
        data : {
            list: trimmedList,
            count: trimmedList.length,
            page: req.query.Page,
            totalPages: totalNumberOfPages
        }
    });
});

/* /api/Days/12 */
router.get("/:id", isAuthenticated, async (req, res) => {

    const day = await Day.findOne({ _id: req.params["id"] }, err => {
        if(err) /* TODO: This is a naive solution for handling input validation, but works, CHANGE LATER*/
            return res.status(config.HTTP.NOT_FOUND).json({
                success: false,
                message: "Day not found.",
            });
    });

    if (!day)
        return res.status(config.HTTP.NOT_FOUND).json({
            sucess: false,
            message: "Day not found.",
        });
    
    res.status(config.HTTP.OK).json(
        {
            success: true,
            message : "retrieved day by id",
            data : {
                id: day._id,
                label: day.label,
                dayOfWeek: day.dayOfWeek
            }
        });
});

/* /api/Days/ */
router.post("/", isAuthenticated, isAdmin, async (req, res) => {

    const exists = await Day.findOne({ $or: [ {label: req.body.label},{dayOfWeek: req.body.dayOfWeek} ]})

    if(exists){
        return res.status(config.HTTP.BAD_REQUEST).json(
            {
                success: false,
                message : "Day already exists.",
            });
    }
    
    const day = new Day({
        label: req.body.label,
        dayOfWeek: req.body.dayOfWeek
    })

    await day.save();

    res.status(config.HTTP.OK).json(
        {
            success: true,
            message : "day created successfully",
            data : {
                id: day._id,
                label: day.label,
                dayOfWeek: day.dayOfWeek
            }
        });
});

/* /api/Days/12 */
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
    /* TODO : findOne does return the document, which is not needed and unnecessarily consumes bandwidth
       Must change to something that doesn't return the actual document ( for the sake of bandwidth usage)
    */
    const day = await Day.findOne({ _id: req.params["id"] }); 

    if (!day) /* Checking if day already exists */
        return res.status(config.HTTP.NOT_FOUND).json({
            success: false,
            message: "Day not found.",
        });

    day.label = req.body.label;
    day.dayOfWeek =  req.body.dayOfWeek;

    await day.save();

    res.status(config.HTTP.OK).json(
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

/* /api/Days/12 */
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const day = await Day.findOneAndDelete({ _id: req.params["id"] });

    if (!day)
        return res.status(config.HTTP.NOT_FOUND).json({
            success: false,
            message: "Day not found.",
        });
    
    res.status(config.HTTP.OK).json({
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
