const express = require('express')
const User_model = require('../models/users')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const { task } = require('../models/tasks')
require('../db/mongoose')

const router = new express.Router()

router.post('/users/login', async (req, res, next) => {
    try {
        const user = await User_model.User.findByCredentials(req.body.email, req.body.password)
        const token = await user.GenerateAuthToken()
        res.send({ user, token })

    } catch (e) {
        next(e)
        // res.status(400).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User_model.User(req.body)
    try {
        await user.save()
        const token = await user.GenerateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)

    // })
})

router.post('/users/logout', auth.auth, async (req, res) => {
    //if we logout from one device we shouldn't logout from all devices!
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth.auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth.auth, async (req, res) => {

    res.send(req.user)

    // User_model.User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.patch('/users/me', auth.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['name', 'email', 'age']
    // const flag = updates.forEach((prop) => {

    //     if (!(prop in allowedUpdates)) {
    //         return false
    //     }
    // })


    // if (!flag) { return res.status(400).send('Property not defined!') }
    try {
        const user = req.user
        updates.forEach((prop) => {
            user[prop] = req.body[prop]
        })

        await user.save()
        //Middleware is ignored in case of highlevel functions such as below, to avoid that we have done above!
        // const user = await User_model.User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth.auth, async (req, res) => {
    try {
        await User_model.User.deleteOne(req.user)
        await task.deleteMany({ user_id: req.user._id })
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = { router }