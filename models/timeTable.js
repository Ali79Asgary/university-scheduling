const mongoose = require('mongoose');
const {courseSchema} = require('./course');
const {studentSchema} = require('./student');
const {timeTableBellSchema} = require('./timeTableBells');
const {masterSchema} = require('./master');

const timeTableSchema = new mongoose.Schema({
    master: {
        type: masterSchema,
    },
    students: {
        type: [studentSchema],
    },
    timeTableBells: {
        type: [timeTableBellSchema]
    },
    course: {
        type: courseSchema,
        required: true
    }
});

const TimeTable = new mongoose.model('TimeTable', timeTableSchema);

exports.TimeTable = TimeTable
exports.timeTableSchema = timeTableSchema;

