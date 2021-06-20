const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeTables:  {
        type: [mongoose.Types.ObjectId],
        ref: 'TimeTable'
    },
    timeTableBells: {
        type: [mongoose.Types.ObjectId],
        ref: 'TimeTableBell'
    },
    courses: {
        type: [mongoose.Types.ObjectId],
        ref: 'Course'
    }
});

const Master = mongoose.model("Master", masterSchema);


exports.Master = Master;
exports.masterSchema = masterSchema;
