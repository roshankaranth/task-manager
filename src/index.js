const express = require('express')
require('./db/mongoose')
const User_model = require('./models/users')
const task_model = require('./models/tasks')
const app = express()
const port = 3000

app.use(express.json())

app.post('/users', async (req, res) => {
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

app.get('/users', async (req, res) => {

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

app.get('/users/:id', async (req, res) => {
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

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'email', 'age']
    const flag = updates.forEach((prop) => {
        if (!(prop in allowedUpdates)) {
            return false
        } else { return true }
    })


    if (!flag) { return res.status(400).send('Property not defined!') }

    const _id = req.params.id
    try {
        const user = await User_model.User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send('User does not exist!')
        }
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/tasks', async (req, res) => {
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

app.get('/tasks', async (req, res) => {

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

app.get('/tasks/:id', async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
    const update = Object.keys(req.body)
    const updatelist = ['description', 'Completed']

    const flag = update.forEach((prop) => {
        if (!(prop in updatelist)) { return false } else { return true }
    })

    if (!flag) { return res.status(404).send('Property not defined!!') }

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

app.listen(port, () => {
    console.log('Server Up and running!')
})