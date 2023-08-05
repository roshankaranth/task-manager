require('../src/db/mongoose')
const User = require('../src/models/users')

// User.User.findById('64c90ddc01456be9c4721772').then((user) => {
//     user.age = 22
//     console.log(user)
//     return User.User.find({ age: 21 })
// }).then((users) => {
//     console.log(users)
// }).catch((e) => {
//     console.log(e)
// })
//To start with async await we need to start with an async function
// User.User.findByIdAndUpdate('64c90ddc01456be9c4721772', { age: 21 }).then((user) => {
//     console.log(user)
//     return User.User.countDocuments({ age: 21 })
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

const user_update = async (id, age) => {
    const user = await User.User.findByIdAndUpdate(id, { age })
    const count = await User.User.countDocuments({ age: 21 })
    return { user, count }
}

user_update('64c90ddc01456be9c4721772', 21).then((data) => {
    console.log(`updated user : ${data.user} \n count: ${data.count}`)
}).catch((e) => {
    console.log(e)
})