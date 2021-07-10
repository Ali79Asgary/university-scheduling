const { User, validate } = require("../models/user");
const { Student } = require("../models/student");
const { Master } = require("../models/master");
const { Day } = require("../models/day");
const { Bell } = require("../models/bell");
const { Course } = require("../models/course");
const { TimeTableBell } = require("../models/timeTableBell");
const { TimeTable } = require("../models/timeTable");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const isStudent = require("../middleware/isStudent");
const express = require("express");

const router = express.Router();


// checking if there is a class in that day.
async function isThereCourseInDay(course, day) {
    const currentCourse = await Course.findById(course._id);
    const courseTimeTables = currentCourse.timeTables;

    for (const courseTimeTable of courseTimeTables) {
        for (const currentTimeTableBell of courseTimeTable.timeTableBells) {

            const timeTableBell = await TimeTableBell.findById(currentTimeTableBell);
            const currentDay = await Day.findById(timeTableBell.Day);
            if (currentDay.dayOfWeek === day.dayOfWeek)
                return true;
        }
    }
    return false;
}

async function isMaxClassPerBellOver(timeTableBell, maxClassPerBell) {
    const allTimeTables = await TimeTable.find({});
    let count = 0;

    for (const currentTimeTable of allTimeTables) {
        for (const currentTimeTableBell of currentTimeTable.timeTableBells) {

            const currentDay = Day.findOne({_id: currentTimeTableBell.Day});
            const currentBell = Bell.findOne({_id: currentTimeTableBell.Bell});

            const timeTableBellDay = Day.findOne({_id: timeTableBell.Day});
            const timeTableBellBell = Bell.findOne({_id: timeTableBell.Bell});

            if ((currentDay.dayOfWeek === timeTableBellDay.dayOfWeek) &&
                (currentBell.bellOfDay === timeTableBellBell.bellOfDay))
                    count++
        }
    }
    return count >= parseInt(maxClassPerBell);
}

router.post('/StartProcess', isAuthenticated, isAdmin, async function(req, res) {
    const courses = await Course.find({});
    const maxClassPerBell = req.query.maxClassPerBell;

    for (const course of courses) {

        if (course.unitCounts === 3) {

            let confirmed_timeTableBells = [];

            for (const master_id of course.masters) {

                const master = await Master.findOne({user: master_id});
                console.log(master);

                if (master.timeTableBells.length === 0)
                    continue;

                for (let i = 0; i < 2; i++) {
                    const currentTimTableBell = await TimeTableBell.
                        findOne({_id: master.timeTableBells[master.timeTableBells.length - 1]._id});

                    const currentDay = await Day.findById(currentTimTableBell.Day);

                    if (!await isThereCourseInDay(course, currentDay) &&
                        !await isMaxClassPerBellOver(master.timeTableBells[master.timeTableBells.length - 1], maxClassPerBell)) {

                        confirmed_timeTableBells.push(master.timeTableBells[master.timeTableBells.length - 1]);

                        const timeTable = new TimeTable({
                            master: master,
                            students: [],
                            timeTableBells: confirmed_timeTableBells,
                            course: course
                        });
                        await timeTable.save();

                        master.timeTables.push(timeTable);
                        master.timeTableBells.pop();
                        await master.save();

                        course.timeTables.push(timeTable);
                        await course.save();

                    }
                }
            }
        }

        if (course.unitCounts === 2 || course.unitCounts === 1) {

            for (const master_id of course.masters) {

                const master = await Master.findOne({user: master_id});

                if (master.timeTableBells.length === 0)
                    continue;

                const currentTimTableBell = await TimeTableBell.
                    findOne({_id: master.timeTableBells[master.timeTableBells.length - 1]._id});

                const currentDay = await Day.findById(currentTimTableBell.Day);

                if (!await isThereCourseInDay(course, currentDay) &&
                    !await isMaxClassPerBellOver(master.timeTableBells[master.timeTableBells.length - 1], maxClassPerBell)) {

                    let usedTimeTableBell = master.timeTableBells.pop();

                    const timeTable = new TimeTable({
                        master: master,
                        students: [],
                        timeTableBells: usedTimeTableBell,
                        course: course
                    });
                    await timeTable.save();

                    master.timeTables.push(timeTable);
                    await master.save();

                    course.timeTables.push(timeTable);
                    await course.save();

                }
            }
        }
        res.status(200).json({
            success: true,
            message: 'Algorithm Finished Successfully.'
        });

    }
})

router.get('/', isAuthenticated, isStudent, async function(req, res) {
    const allTimeTables = await TimeTable.find({master: req.query['MasterId'], course: req.query['CourseId']});

    const timeTables = [];
    const timeTableBells = [];

    for (const timeTable of allTimeTables) {
        const course = await Course.findOne({_id: timeTable.course});
        const master = await Master.findOne({_id: timeTable.master});
        const user = await User.findOne({_id: master.user});

        for (const timeTableBellId of timeTable.timeTableBells) {
            const timeTableBell = await TimeTableBell.findOne({_id: timeTableBellId});
            const bell = await Bell.findOne({_id: timeTableBell.Bell});
            const day = await Day.findOne({_id: timeTableBell.Day});

            timeTableBells.push(
                {
                    id: timeTableBell._id,
                    day: {
                        id: day._id,
                        label: day.label,
                        dayOfWeek: day.dayOfWeek
                    },
                    bell: {
                        id: bell._id,
                        label: bell.label,
                        bellOfDay: bell.bellOfDay
                    }
                }
            );
        }
        timeTables.push(
            {
                id: timeTable._id,
                course: {
                    id: course._id,
                    title: course.title,
                    unitsCount: course.unitCounts
                },
                master: {
                    id: master._id,
                    userId: user._id,
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        code: user.code,
                        role: user.role
                    },
                    timeTableBells: timeTableBells
                }
            }
        );

    }

    const totalNumberOfPages = Math.ceil(timeTables.length / req.query.PageSize);

    const startIndex = (req.query.Page - 1) * req.query.PageSize;
    const trimmedList = timeTables.slice(startIndex, startIndex + parseInt(req.query.PageSize));

    return res.status(200).json({
        success: true,
        message: "TimeTable list returned successfully.",
        data: {
            list: trimmedList,
            count: trimmedList.length,
            page: req.query['Page'],
            totalPages: totalNumberOfPages
        }

    });


})

router.get('/:id', isAuthenticated, isStudent, async function(req, res) {
    const timeTable = await TimeTable.findById(req.params['id']);
    const master = await Master.findOne({_id: timeTable.master});
    const user = await User.findOne({_id: master.user});

    if (!timeTable)
        return res.status(404).json({
            success: false,
            message: "TimeTable not found."
        });

    if (!master)
        return res.status(404).json({
            success: false,
            message: "Master not found."
        });

    const allTimeTableBells = [];
    for (const timeTableBellId of timeTable.timeTableBells) {

        const timeTableBell = await TimeTableBell.findOne({_id: timeTable.timeTableBells});
        const bell = await Bell.findOne({_id: timeTableBell.Bell});
        const day = await Day.findOne({_id: timeTableBell.Day});

        allTimeTableBells.push(
            {
                id: timeTableBell._id,
                day: {
                    id: day._id,
                    label: day.label,
                    dayOfWeek: day.dayOfWeek
                },
                bell: {
                    id: bell._id,
                    label: bell.label,
                    bellOfDay: bell.bellOfDay
                }
            }
        );
    }

    const course = await Course.findOne({_id: timeTable.course});

    return res.status(200).json({
       success: true,
       message: "TimeTable returned successfully.",
       data: {
           id: timeTable._id,
           master: {
               id: master._id,
               userId: master.user,
               user: {
                   id: user._id,
                   lastName: user.lastName,
                   firstName: user.firstName,
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
       }
    });
})

router.post('/:id/Choose', isAuthenticated, isStudent, async function(req, res) {
    const timeTable = await TimeTable.findById(req.params['id']);
    const student = await Student.findOne({user: req.user});

    if (!timeTable)
        return res.status(404).json({
            success: false,
            message: "TimeTable not found."
        });

    if (!student)
        return res.status(404).json({
            success: false,
            message: "Student not found."
        });

    timeTable.students.push(student);
    timeTable.save();

    return res.status(404).json({
        success: true,
        message: "Unit selection completed."
    });

})

module.exports = router;
