const mongoose = require("mongoose");
const {userSchema} = require('./user');
const {timeTableSchema} = require('./timeTable')

const studentSchema = new mongoose.Schema({
    user: {
        type: userSchema,
        required: true
    },
    timeTables:  {
        type: [timeTableSchema],
    }
});

const Student = mongoose.model("Student", studentSchema);


exports.Student = Student;
exports.studentSchema = studentSchema;
