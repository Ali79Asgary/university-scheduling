const mongoose = require("mongoose");


const bellSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    bellOfDay:  {
        type: Number,
    }
});

const Bell = mongoose.model("Bell", bellSchema);


exports.Bell = Bell;
exports.bellSchema = bellSchema;
