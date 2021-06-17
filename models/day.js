const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    dayOfWeek:  {
        type: Number,
    }
});

const Day = mongoose.model("Day", daySchema);


exports.Day = Day;
exports.daySchema = daySchema;
