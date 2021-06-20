const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    timetable: {
        type: mongoose.Types.ObjectId,
        ref: 'TimeTable',
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
