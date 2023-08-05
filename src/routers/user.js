const express = require('express')
const User_model = require('../models/users')
const bcrypt = require('bcryptjs')
require('../db/mongoose')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User_model.User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)

    // })
})

router.get('/users', async (req, res) => {

    try {
        const users = await User_model.User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }

    // User_model.User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id


    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const user = await User_model.User.findById(_id)
            if (!user) {
                return res.status(404).send('User not found!')
            }
            res.send(user)
        } catch (e) {
            res.status(500).send(e)
        }

    } else {
        return res.status(400).send('Invalid objectID!')
    }
    // if (_id.match(/^[0-9a-fA-F]{24}$/)) {
    //     User_model.User.findById(_id).then((user) => {
    //         if (!user) {
    //             return res.status(404).send('User not found!')
    //         }
    //         res.send(user)
    //     }).catch((e) => {
    //         res.status(500).send(e)
    //     })
    // } else {
    //     return res.status(400).send('Invalid objectID!')
    // }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['name', 'email', 'age']
    // const flag = updates.forEach((prop) => {

    //     if (!(prop in allowedUpdates)) {
    //         return false
    //     }
    // })


    // if (!flag) { return res.status(400).send('Property not defined!') }

    const _id = req.params.id
    try {
        const user = await User_model.User.findById(_id)
        updates.forEach((prop) => {
            user[prop] = req.body[prop]
        })

        await user.save()
        //Middleware is ignored in case of highlevel functions such as below, to avoid that we have done above!
        // const user = await User_model.User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send('User does not exist!')
        }
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const del_user = await User_model.User.findByIdAndDelete(_id)
        if (!del_user) { return res.status(404).send("User not found!") }
        res.send(del_user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = { router }