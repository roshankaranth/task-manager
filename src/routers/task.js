const express = require('express')
const task_model = require('../models/tasks')
require('../db/mongoose')

const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new task_model.task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', async (req, res) => {

    try {
        const task = await task_model.task.find({ Completed: false })
        res.send(task)
    } catch (e) {
        res.send(e)
    }

    // task_model.task.find({}).then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.send(e)
    // })
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const task = await task_model.task.findById(_id)
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

router.patch('/tasks/:id', async (req, res) => {
    // const update = Object.keys(req.body)
    // const updatelist = ['description', 'Completed']

    // const flag = update.forEach((prop) => {
    //     if (!(prop in updatelist)) { return false } else { return true }
    // })

    // if (!flag) { return res.status(404).send('Property not defined!!') }

    const _id = req.params.id
    try {
        const task = await task_model.task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send('task not found!')
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const del_task = await task_model.task.findByIdAndDelete(_id)
        if (!del_task) { return res.status(404).send("Task not found!!") }
        res.send(del_task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = { router }