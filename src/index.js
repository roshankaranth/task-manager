const express = require('express')
require('./db/mongoose')
const User_model = require('./models/users')
const task_model = require('./models/tasks')
const app = express()
const port = 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User_model.User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)

    })
})

app.get('/users', (req, res) => {
    User_model.User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id


    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        User_model.User.findById(_id).then((user) => {
            if (!user) {
                return res.status(404).send('User not found!')
            }
            res.send(user)
        }).catch((e) => {
            res.status(500).send(e)
        })
    } else {
        return res.status(400).send('Invalid objectID!')
    }
})

app.post('/tasks', (req, res) => {
    const task = new task_model.task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/tasks', (req, res) => {
    task_model.task.find({}).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.send(e)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        task_model.task.findById(_id).then((task) => {
            if (!task) {
                return res.status(404).send('Task not found!')
            }
            res.send(task)
        }).catch((e) => {
            res.status(500).send(e)
        })
    } else {
        return res.send('Invalid object ID!')
    }
})

app.listen(port, () => {
    console.log('Server Up and running!')
})