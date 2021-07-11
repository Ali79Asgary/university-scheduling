const { Announcement } = require('../models/announcement');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');
const isMaster = require('../middleware/isMaster');
const express = require('express');
const { TimeTable } = require('../models/timeTable');
const isAdminOrMaster = require('../middleware/isAdminOrMaster');
const router = express.Router();

router.get('/', isAuthenticated, async(req, res) => {

    const announcements = await Announcement
    .find({})
    .populate({path : "timetable", 
        populate : [ 
            {path: "course"}, 
            {path: "timeTableBells", populate : {path : "Day Bell"}, },
            {path: "master", populate : {path : "user"}}
        ] } )

    const listOfAnnouncements = [];
    masterId = req.query.MasterId;
    timeTableId = req.query.TimeTableId;

    for(const doc of announcements) {
        if(
            ( !masterId && !timeTableId ) ||
            ( masterId && !timeTableId && masterId == doc.timetable.master._id) ||
            ( !masterId && timeTableId && timeTableId == doc.timetable._id) ||
            ( masterId && timeTableId && masterId == doc.timetable.master._id && timeTableId == doc.timetable._id)
         ){
            const allTimeTableBells = [];
            for (const timeTableBell of doc.timetable.timeTableBells) {
                allTimeTableBells.push(
                    {
                        id: timeTableBell._id,
                        day: {
                            id: timeTableBell.Day._id,
                            label: timeTableBell.Day.label,
                            dayOfWeek: timeTableBell.Day.dayOfWeek
                        },
                        bell: {
                            id: timeTableBell.Bell._id,
                            label: timeTableBell.Bell.label,
                            bellOfDay: timeTableBell.Bell.bellOfDay
                        }
                    }
                );
            }
            listOfAnnouncements.push({
                id: doc._id,
                timeTableId: doc.timetable._id,
                timeTable: {
                    id: doc.timetable._id,
                    master: {
                        id: doc.timetable.master._id,
                        userId: doc.timetable.master.userId,
                        user: {
                            id: doc.timetable.master.user._id,
                            lastName: doc.timetable.master.user.lastName,
                            firstName: doc.timetable.master.user.firstName,
                            code: doc.timetable.master.user.code,
                            role: doc.timetable.master.user.role
                        }
                    },
                    timeTableBells: allTimeTableBells,
                    course: {
                        id: doc.timetable.course._id,
                        title: doc.timetable.course.title,
                        unitCounts: doc.timetable.course.unitCounts
                    }
                },
                message: doc.message
            })
         }

    }

    const totalPagesCount = Math.ceil(listOfAnnouncements.length / req.query.PageSize);
    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = listOfAnnouncements.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    res.status(200).json({
        success: true,
        message: "list of announcements",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            page: parseInt(req.query.Page),
            totalPages: totalPagesCount
        }
    })
});

router.get("/:id", isAuthenticated, async(req, res) => {

    const announcement = await Announcement
    .findById(req.params["id"])
    .populate("timetable");

    if (!announcement) {
        res.status(404).json({
            success: false,
            message: "Announcement doesnt exist."
        })
    }

    const timeTable = await announcement.timetable
    .populate({path: "timeTableBells", populate : {path : "Day Bell"}})
    .populate({path: "master", populate : {path : "user"}})
    .populate({path: "course"})
    .execPopulate();

    const allTimeTableBells = [];
    for (const timeTableBell of timeTable.timeTableBells) {
        allTimeTableBells.push(
            {
                id: timeTableBell._id,
                day: {
                    id: timeTableBell.Day._id,
                    label: timeTableBell.Day.label,
                    dayOfWeek: timeTableBell.Day.dayOfWeek
                },
                bell: {
                    id: timeTableBell.Bell._id,
                    label: timeTableBell.Bell.label,
                    bellOfDay: timeTableBell.Bell.bellOfDay
                }
            }
        );
    }

    const master = timeTable.master
    const user = master.user
    const course = timeTable.course

    res.status(200).json({
        success: true,
        message: "Announcement returned successfully.",
        data: {
            id: announcement._id,
            timeTableId: timeTable._id,
            timeTable: {
                id: timeTable._id,
                master: {
                    id: master._id,
                    userId: master.userId,
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        code: user.code
                    }
                },
                timeTableBells: allTimeTableBells,
                course: {
                    id: course._id,
                    title: course.title,
                    unitsCount: course.unitCounts
                }
            },
            message: req.body.message
        }
    });
});

router.post('/', isAuthenticated, isAdminOrMaster, async(req, res) => {

    let timeTable = await TimeTable
    .findById(req.body.timeTableId)
    .populate({path: "timeTableBells", populate : {path : "Day Bell"}})
    .populate({path: "master", populate : {path : "user"}})
    .populate({path: "course"});

    if (!timeTable) {
        return res.status(400).json({
            success: false,
            message: "timeTable doesn't exist."
        })
    }

    let announcement = new Announcement({
        timetable: timeTable,
        message: req.body.message
    })

    await announcement.save();

    const allTimeTableBells = [];
    for (const timeTableBell of timeTable.timeTableBells) {
        allTimeTableBells.push(
            {
                id: timeTableBell._id,
                day: {
                    id: timeTableBell.Day._id,
                    label: timeTableBell.Day.label,
                    dayOfWeek: timeTableBell.Day.dayOfWeek
                },
                bell: {
                    id: timeTableBell.Bell._id,
                    label: timeTableBell.Bell.label,
                    bellOfDay: timeTableBell.Bell.bellOfDay
                }
            }
        );
    }

    const master = timeTable.master
    const user = master.user
    const course = timeTable.course

    res.status(200).json({
        success: true,
        message: "Announcement created successfully.",
        data: {
            id: announcement._id,
            timeTableId: timeTable._id,
            timeTable: {
                id: timeTable._id,
                master: {
                    id: master._id,
                    userId: master.userId,
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        code: user.code
                    }
                },
                timeTableBells: allTimeTableBells,
                course: {
                    id: course._id,
                    title: course.title,
                    unitsCount: course.unitCounts
                }
            },
            message: req.body.message
        }
    });
});

router.delete("/:id", isAdminOrMaster, async(req, res) => {

    const deletedAnnouncement = await Announcement.findOneAndDelete({ _id: req.params["id"] });

    if (!deletedAnnouncement) {
        return res.status(404).json({
            success: false,
            message: "Announcement doesnt exist."
        })
    }

    res.status(200).json({
        success: true,
        message: "Announcement deleted successfully.",
        data: {
            timeTableId: deletedAnnouncement.timetable,
            message: deletedAnnouncement.message
        }
    })
});

module.exports = router;