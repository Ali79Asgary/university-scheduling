const { Course } = require("../models/course");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const isMaster = require("../middleware/isMaster");
const express = require("express");
const router = express.Router();
const mongo = require("mongodb");

/*
    /api/Courses
*/

function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
}

router.get("/", isAuthenticated, isAdmin, async (req, res) => {
    const criteria = {
        $and: [
            { title: { $regex: `/${req.body.search}/`, $options: "i" } },
            { unitCounts: req.body.unitCount },
        ],
    };
    await Course.find(criteria, function (err, doc) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "The requested course does not exist!",
            });
        }

        if (doc.length == 0) {
            return res.status(200).json({
                success: true,
                message: "The requested course found successfully!",
                data: {
                    list: [],
                    count: 0,
                    page: 0,
                    totalPages: 0,
                },
            });
        }

        resList = splitArrayIntoChunksOfLen(doc, req.body.PageSize);
        return res.status(200).json({
            success: true,
            message: "The requested courses found successfully!",
            data: {
                list:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1]
                        : resList[req.body.Page],
                count:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1].length
                        : resList[req.body.Page].length,
                page:
                    resList.length < req.body.Page
                        ? resList.length
                        : req.body.page,
                totalPages: resList.length,
            },
        });
    });
});

//done
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
    const course = await Course.findOne({ title: req.body.title });

    if (course)
        return res.status(400).json({
            success: false,
            message: "Course already exists",
        });

    const newCourse = new Course({
        title: req.body.title,
        unitCounts: req.body.unitsCount,
        masters: [],
        timeTables: [],
    });

    await newCourse.save();

    return res.status(200).json({
        success: true,
        message: "The requested course created successfully!",
        data: {
            id: newCourse._id,
            title: newCourse.title,
            unitsCount: newCourse.unitCounts,
        },
    });
});

//done
router.get("/:id", isAuthenticated, isAdmin, async (req, res) => {
    const course = await Course.findById(req.params["id"]);

    if (!course) {
        return res.status(400).json({
            success: false,
            message: "The requested course does not exist!",
        });
    }

    return res.status(200).json({
        success: true,
        message: "The requested course found successfully!",
        data: {
            id: course._id,
            title: course.title,
            unitsCount: course.unitCounts,
        },
    });
});

//done
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
    await Course.findOneAndUpdate(
        { _id: req.params["id"] },
        { title: req.body.title, unitCounts: req.body.unitsCount },
        function (err, doc) {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: "The update procedure failed!",
                });
            }
            return res.status(200).json({
                success: true,
                message: "The requested updated successfully!",
            });
        }
    );
});

//done
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
    await Course.findByIdAndDelete(req.params["id"], function (err, doc) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "The requested course does not exist!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "The requested course deleted successfully!",
        });
    });
});

//done*
router.get("/:id/TimeTables", isAuthenticated, async (req, res) => {
    await Course.findById(req.params["id"], function (err, doc) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "The requested course does not exist!",
            });
        }

        timeTable = doc.timeTables;
        if (timeTable.length == 0) {
            return res.status(200).json({
                success: true,
                message: "The requested course found successfully!",
                data: {
                    list: [],
                    count: 0,
                    page: 0,
                    totalPages: 0,
                },
            });
        }
        resList = splitArrayIntoChunksOfLen(timeTable, req.body.PageSize);

        return res.status(200).json({
            success: true,
            message: "The requested course found successfully!",
            data: {
                list:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1]
                        : resList[req.body.Page],
                count:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1].length
                        : resList[req.body.Page].length,
                page:
                    resList.length < req.body.Page
                        ? resList.length
                        : req.body.page,
                totalPages: resList.length,
            },
        });
    });
});

//done*
router.get("/:id/Masters", isAuthenticated, async (req, res) => {
    await Course.findById(req.params["id"], function (err, doc) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "The requested course does not exist!",
            });
        }

        masters = doc.masters;
        if (masters.length == 0) {
            return res.status(200).json({
                success: true,
                message: "The requested course found successfully!",
                data: {
                    list: [],
                    count: 0,
                    page: 0,
                    totalPages: 0,
                },
            });
        }
        resList = splitArrayIntoChunksOfLen(masters, req.body.PageSize);

        return res.status(200).json({
            success: true,
            message: "The requested course found successfully!",
            data: {
                list:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1]
                        : resList[req.body.Page],
                count:
                    resList.length < req.body.Page
                        ? resList[resList.length - 1].length
                        : resList[req.body.Page].length,
                page:
                    resList.length < req.body.Page
                        ? resList.length
                        : req.body.page,
                totalPages: resList.length,
            },
        });
    });
});

//done
router.post("/:id/Choose", isAuthenticated, isMaster, async (req, res) => {
    const course = await Course.findById(req.params["id"]);
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "The requested course does not exist!",
        });
    }
    const masters = course.masters;
    if (masters.includes(mongo.ObjectID(req.user._id))) {
        return res.status(404).json({
            success: false,
            message: "Already Chosen!",
        });
    }
    masters.push(mongo.ObjectID(req.user._id));

    await Course.findOneAndUpdate({ _id: req.params["id"] }, { masters }, function (err, doc) {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: "The requested operation did not succeed!",
                });
            }
            return res.status(200).json({
                success: true,
                message: "The master added successfully to the course!",
            });
        }
    );
});

module.exports = router;
