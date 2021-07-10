const { User, validate } = require("../models/user");
const { Student } = require("../models/student");
const { Admin } = require("../models/admin");
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

                for (let i = 0; i <= 2; i++) {
                    const currentTimTableBell = await TimeTableBell.
                        findOne({_id: master.timeTableBells[master.timeTableBells.length - 1]._id});

                    const currentDay = await Day.findById(currentTimTableBell.Day);

                    if (!await isThereCourseInDay(course, currentDay) &&
                        !await isMaxClassPerBellOver(master.timeTableBells[master.timeTableBells.length - 1], maxClassPerBell)) {

                        confirmed_timeTableBells.push(master.timeTableBells[master.timeTableBells.length - 1]);
                        master.timeTableBells.pop();

                        const timeTable = new TimeTable({
                            master: master,
                            students: [],
                            timeTableBells: confirmed_timeTableBells,
                            course: course
                        });

                        await Master.findOneAndUpdate(
                            {_id: master._id},
                            {timeTableBells: master.timeTableBells, timTable: timeTable}
                        );

                        await timeTable.save();
                        // course.timeTable = timeTable;

                        await Course.findOneAndUpdate(
                            {_id: course._id},
                            {timeTable: timeTable}
                            )
                        break;
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

                    await Master.findOneAndUpdate(
                        {_id: master._id},
                        {timeTableBells: master.timeTableBells, timeTable: timeTable}
                    );

                    await timeTable.save();
                    // course.timeTable = timeTable;

                    await Course.findOneAndUpdate(
                        {_id: course._id},
                        {timeTable: timeTable}
                    )
                    break;
                }

            }
        }
        res.status(200).json({
            success: true,
            message: 'Algorithm Finished Successfully.'
        });

    }
})
router.get('/:id', isAuthenticated, isStudent, async function(req, res) {
    const timeTable = await TimeTable.findById(req.params['id']);
    const master = await Master.findOne({_id: timeTable.master});
    console.log()
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
