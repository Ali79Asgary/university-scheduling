const mongoose = require("mongoose");
const {userSchema} = require('./user');
const {timeTableSchema} = require('./timeTable');
const {timeTableBellSchema} = require('./timeTableBells');
const {courseSchema} = require('./course');

const masterSchema = new mongoose.Schema({
    user: {
        type: userSchema,
        required: true
    },
    timeTables:  {
        type: [timeTableSchema],
    },
    timeTableBells: {
        type: [timeTableBellSchema],
    },
    courses: {
        type: [courseSchema],
    }
});

const Master = mongoose.model("Master", masterSchema);


exports.Master = Master;
exports.masterSchema = masterSchema;
