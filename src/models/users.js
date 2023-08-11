const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { task } = require('../models/tasks')

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
    },
    //subdocument!
    tokens: [{ token: { type: String, required: true } }]
}, {
    timestamps: true
})
// objects are stringified in res.send(). toJSON() is called whenever that object is stringified..
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
//virtual property is a relationship between two models/entities and not actual data in a database
userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'user_id'
})
//static method accessible on models and method accessible on instances of model
userSchema.methods.GenerateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismyapp')
    user.tokens.push({ token })
    await user.save()
    return token
}

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
//remove function is deprecated
userSchema.pre('remove', async function (next) {
    const user = this
    task.deleteMany({ user_id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User }