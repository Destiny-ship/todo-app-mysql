// fetch mongoose required to talk to mongodb
const mongoose = require('mongoose');

// The rules: what a task looks like
const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        done: { type: Boolean, default: false }
    },
    { timestamps: true }
);

//Turn the rules into a model and share it with other files
module.exports = mongoose.model('Task', taskSchema);