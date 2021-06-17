const mongoose = require("mongoose");
const {timeTableSchema} = require('./timeTable')

const announcementSchema = new mongoose.Schema({
    timetable: {
        type: timeTableSchema,
        required: true
    },
    message:  {
        type: String,
        required: true
    }
});

const Announcement = mongoose.model("Announcement", announcementSchema);


exports.Announcement = Announcement;
exports.announcementSchema = announcementSchema;
