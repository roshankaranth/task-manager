require('../src/db/mongoose')
const { task } = require('../src/models/tasks')

// task.findByIdAndDelete('64c911c8ba252f38d27ca86c').then((task1) => {
//     console.log(task1)
//     return task.find({ Completed: false })
// }).then((tasks) => {
//     console.log(tasks)
// }).catch((e) => {
//     console.log(e)
// })

const deletetask_count = async (id) => {
    const taskd = await task.findByIdAndDelete(id)
    const count = await task.find({ Completed: false })
    return { taskd, count }
}

deletetask_count('64cb123187246374747284ac').then((data) => {
    console.log(`deleted task : ${data.taskd} \n count: ${data.count}`)
}).catch((e) => {
    console.log(e)
})