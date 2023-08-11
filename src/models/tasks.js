const mongoose = require('mongoose')

const task = mongoose.model('task', {
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
})

module.exports = { task }