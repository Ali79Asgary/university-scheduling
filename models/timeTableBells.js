const mongoose = require("mongoose");
const {timeTableSchema} = require('./timeTable');
const {bellSchema} = require('./bell');
const {daySchema} = require('./day');

const timeTableBellSchema = new mongoose.Schema({
    Day: {
        type: daySchema,
        required: true
    },
    Bell: {
        type: bellSchema,
        required: true
    },
    timeTable:  {
        type: timeTableSchema,
    }
});

const TimeTableBell = mongoose.model("TimeTableBell", timeTableBellSchema);


exports.TimeTableBell = TimeTableBell;
exports.timeTableBellSchema = timeTableBellSchema;
