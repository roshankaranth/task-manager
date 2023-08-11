const express = require('express')
const task_model = require('../models/tasks')
require('../db/mongoose')

const router = new express.Router()
const auth = require('../middleware/auth')
const { User } = require('../models/users')
router.post('/tasks', auth.auth, async (req, res) => {
    // const task = new task_model.task(req.body)
    const task = new task_model.task({
        ...req.body,
        user_id: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/tasks', auth.auth, async (req, res) => {
    //alternative option
    // const user = await User.findById('64d538231e5677aec17a1f9b')
    // await user.populate('tasks')
    // console.log(user.tasks)

    try {
        const task = await task_model.task.find({ user_id: req.user._id })
        res.send(task)
    } catch (e) {
        res.send(e)
    }

})

router.get('/tasks/:id', auth.auth, async (req, res) => {
    const _id = req.params.id

    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const task = await task_model.task.findOne({ _id, user_id: req.user._id })
            if (!task) {
                return res.status(404).send('Task not found!')
            }
            res.send(task)
        } catch (e) {
            res.status(500).send(e)
        }

        // task_model.task.findById(_id).then((task) => {
        //     if (!task) {
        //         return res.status(404).send('Task not found!')
        //     }
        //     res.send(task)
        // }).catch((e) => {
        //     res.status(500).send(e)
        // })

    } else {
        return res.send('Invalid object ID!')
    }
})

router.patch('/tasks/:id', auth.auth, async (req, res) => {
    const update = Object.keys(req.body)

    // const updatelist = ['description', 'Completed']

    // const flag = update.forEach((prop) => {
    //     if (!(prop in updatelist)) { return false } else { return true }
    // })

    // if (!flag) { return res.status(404).send('Property not defined!!') }

    const _id = req.params.id
    try {
        const update_task = await task_model.task.findOne({ _id, user_id: req.user._id })
        if (!update_task) {
            return res.status(404).send('task not found!')
        }

        update.forEach((prop) => {
            update_task[prop] = req.body[prop]
        })
        await update_task.save()

        //const update_task = await task_model.task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        res.send(update_task)
    } catch (e) {

        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth.auth, async (req, res) => {
    const _id = req.params.id

    try {
        const del_task = await task_model.task.findOneAndDelete({ _id, user_id: req.user._id })
        console.log(del_task)
        if (!del_task) { return res.status(404).send("Task not found!!") }
        res.send(del_task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = { router }