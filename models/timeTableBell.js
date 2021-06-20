const mongoose = require("mongoose");

const timeTableBellSchema = new mongoose.Schema({
    Day: {
        type: mongoose.Types.ObjectId,
        ref: 'Day',
        required: true
    },
    Bell: {
        type: mongoose.Types.ObjectId,
        ref: 'Bell',
        required: true
    },
    timeTable: {
        type: mongoose.Types.ObjectId,
        ref: 'TimeTable'
    }
});

const TimeTableBell = mongoose.model("TimeTableBell", timeTableBellSchema);


exports.TimeTableBell = TimeTableBell;
exports.timeTableBellSchema = timeTableBellSchema;
