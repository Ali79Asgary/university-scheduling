const { Course } = require("../models/course");
const { User } = require("../models/user");
const { Master } = require("../models/master");
const { Bell } = require("../models/bell");
const { Day } = require("../models/day");
const { TimeTableBell } = require("../models/timeTableBell");
const { TimeTable } = require("../models/timeTable");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const isMaster = require("../middleware/isMaster");
const express = require("express");
const mongo = require("mongodb");
const router = express.Router();

/*
    /api/Courses
*/
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
    const criteria = {
        $and: [
            { title: { $regex: `${req.query.search}`, $options: "i" } },
            { unitCounts: req.query.unitCount },
        ],
    };
    const courses = await Course.find(criteria);

    if (courses.length === 0)
        return res.status(404).json({
            success: false,
            message: "The requested course does not exist!",
        });

    const courseList = [];
    for (const course of courses) {
        courseList.push(
            {
                title: course.title,
                id: course._id,
                unitsCount: course.unitCounts
            }
        );
    }

    const totalPagesCount = Math.ceil(courseList.length / req.query.PageSize);
    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = courseList.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    return res.status(200).json({
        success: true,
        message: "The requested courses found successfully!",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            page: req.query.Page,
            totalPages: totalPagesCount
        },
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
            if(!doc){
                return res.status(404).json({
                    success: false,
                    message: "Course doesn't exist",
                });
            }
            return res.status(200).json({
                success: true,
                message: "The requested updated successfully!",
                data: {
                    id : doc._id,
                    title: req.body.title,
                    unitsCount: req.body.unitsCount
                }
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
                message: "The requested course does not exist!"
            });
        }
        if(!doc)
            return res.status(404).json({
                success: false,
                message: "The requested course does not exist!",
            });
        return res.status(200).json({
            success: true,
            message: "The requested course deleted successfully!",
            data: {
                id : doc._id,
                title: doc.title,
                unitsCount: doc.unitCounts
            }
        });
    });
});

//done*
router.get("/:id/TimeTables", isAuthenticated, async (req, res) => {
    const course = await Course.findById(req.params["id"]);
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "The requested course does not exist!",
        });
    }

    if (course.timeTables.length === 0) {
        return res.status(200).json({
            success: true,
            message: "The requested course has not any Time Tables!",
            data: {
                list: [],
                count: 0,
                page: 0,
                totalPages: 0,
            },
        });
    }

    const resList = [];
    const timeTableBells = [];

    for (const timeTableId of course.timeTables) {

        const timeTable = await TimeTable.findOne({_id: timeTableId});
        const master = await Master.findOne({_id: timeTable.master});
        const user = await User.findOne({_id: master.user});

        for (const timeTableBellId of timeTable.timeTableBells) {

            const timeTableBell = await TimeTableBell.findOne({_id: timeTableBellId});
            const bell = await Bell.findOne({_id: timeTableBell.Bell});
            const day = await Day.findOne({_id: timeTableBell.Day});

            timeTableBells.push(
                {
                    id: timeTableBell._id,
                    bell: {
                        id: bell._id,
                        label: bell.label,
                        bellOfDay: bell.bellOfDay
                    },
                    day: {
                        id: day._id,
                        label: day.label,
                        dayOfWeek: day.dayOfWeek
                    }
                });
        }
        resList.push({
            id: timeTable._id,
            master: {
                id: master._id,
                userId: user._id,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    code: user.code,
                    role: user.role
                }
            },
            timeTableBells: timeTableBells
        });
    }
    const totalPagesCount = Math.ceil(resList.length / req.query.PageSize);
    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = resList.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    return res.status(200).json({
        success: true,
        message: "The requested course found successfully!",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            page: parseInt(req.query.Page),
            totalPages: totalPagesCount
        },
    });
});

//done*
router.get("/:id/Masters", isAuthenticated, async (req, res) => {
    const course = await Course.findById(req.params["id"]);
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "The requested course does not exist!",
        });
    }

    if (course.masters.length === 0) {
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
    const resList = [];
    for (const masterId of course.masters) {

        const master = await Master.findOne({user: masterId});
        const user = await User.findOne({_id: master.user});

        resList.push({
            id: master._id,
            userId: user._id,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                code: user.code,
                role: user.role
            }
        });
    }

    const totalPagesCount = Math.ceil(resList.length / req.query.PageSize);
    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = resList.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    return res.status(200).json({
        success: true,
        message: "The requested course found successfully!",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            page: parseInt(req.query.Page),
            totalPages: totalPagesCount
        },
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
