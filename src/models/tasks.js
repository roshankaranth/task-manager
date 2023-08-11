const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    description:
    {
        type: String,
        required: true,
        trim: true
    },
    Completed: { type: Boolean, default: false },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

const task = mongoose.model('task', taskSchema)

module.exports = { task }