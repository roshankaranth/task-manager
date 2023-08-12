const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = 3000


app.use(express.json())
app.use(userRouter.router)
app.use(taskRouter.router)

app.listen(port, () => {
    console.log('Server Up and running!')
})

const { task } = require('./models/tasks')
const { User } = require('./models/users')


//virtual, populate mongoose topics



