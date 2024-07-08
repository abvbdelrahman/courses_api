const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true }
    // code: { type: String, required: true, unique: true },
    // startDate: { type: Date, required: true },
    // endDate: { type: Date, required: true },
    // level: { type: String, required: true },
    // description: { type: String, required: true },
    // instructor: { type: String, required: true },
    // duration: { type: Number, required: true },
    // students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Course', courseSchema);