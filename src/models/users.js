const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: { type: String, trim: true },
    age: {
        type: Number, validate(value) {
            if (value < 0) {
                throw new Error('age must be positive number')
            }

        },
        default: 0

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email address is not valid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('Length of password must be greater than 6!')

            }
            if (value.includes('password')) {
                throw new Error('Password cannot be password')
            }
        },
        trim: true
    }
})

module.exports = { User }