const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeTables:  {
        type: [mongoose.Types.ObjectId],
        ref: 'TimeTable'
    }
});

const Student = mongoose.model("Student", studentSchema);


exports.Student = Student;
exports.studentSchema = studentSchema;
