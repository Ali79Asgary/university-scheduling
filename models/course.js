const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    unitCounts: {
        type: Number,
        required: true
    },
    masters: {
        type: [mongoose.Types.ObjectId],
        ref: 'Master'
    },
    timeTables:  {
        type: [mongoose.Types.ObjectId],
        ref: 'TimeTable'
    }
});

const Course = mongoose.model("Course", courseSchema);


exports.Course = Course;
exports.courseSchema = courseSchema;
