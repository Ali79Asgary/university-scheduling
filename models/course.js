const mongoose = require("mongoose");
const {timeTableSchema} = require('./timeTable');
const {masterSchema} = require('./master');

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
        type: [masterSchema],
    },
    timeTables:  {
        type: [timeTableSchema],
    }
});

const Course = mongoose.model("Course", courseSchema);


exports.Course = Course;
exports.courseSchema = courseSchema;
