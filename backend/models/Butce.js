const mongoose = require("mongoose");

const butceSchema = new mongoose.Schema({
    departman: { type: String, required: true },
    yillik:    { type: Number, required: true },
    q1:        { type: Number, default: 0 },
    q1g:       { type: Number, default: 0 },
    q2:        { type: Number, default: 0 },
    q2g:       { type: Number, default: 0 },
    q3plan:    { type: Number, default: 0 },
    q4plan:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Butce", butceSchema);