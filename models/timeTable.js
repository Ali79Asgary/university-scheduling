const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    master: {
        type: mongoose.Types.ObjectId,
        ref: 'Master'
    },
    students: {
        type: [mongoose.Types.ObjectId],
        ref: 'Student'
    },
    timeTableBells: {
        type: [mongoose.Types.ObjectId],
        ref: 'TimeTableBell'
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

const TimeTable = new mongoose.model('TimeTable', timeTableSchema);

exports.TimeTable = TimeTable
exports.timeTableSchema = timeTableSchema;

