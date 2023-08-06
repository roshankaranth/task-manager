const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
        unique: true,
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

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        console.log('Im here!')
        throw new Error('User does not exist!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to login!")
    }
    return user
}

//no arrow functions cause this binding!!
//next gets called to let it know we are done with all the tasks to be done before saving the user
userSchema.pre('save', async function (next) {
    //We do not want to rehash the password if it is already hashed.
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User }