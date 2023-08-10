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

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: '28hudh932idns' }, 'thisismyfirstoken!', { expiresIn: '10 second' })
//     console.log(token)

//     console.log(jwt.verify(token, 'thisismyfirstoken!'))
// }


// myFunction()