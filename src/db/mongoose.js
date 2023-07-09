const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/task_manager_api')

const User = mongoose.model('User', { name: { type: String }, age: { type: Number } })
//User is a constructor function

// const admin = new User({ name: 'Roshan', age: 21 })

// admin.save().then(() => {
//     console.log(admin)
// }).catch((error) => {
//     console.log('Error', error)
// })

const task = mongoose.model('tasks', { description: { type: String }, Completed: { type: Boolean } })

const read_a_book = new task({ description: 'Read deep work book', Completed: false })
read_a_book.save().then(() => {
    console.log(read_a_book)
}).catch((error) => {
    console.log(error)
})