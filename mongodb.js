const mongodb = require('mongodb')

const DatabaseUrl = 'mongodb://127.0.0.1:27017'
const client = new mongodb.MongoClient(DatabaseUrl)
const ObjectId = mongodb.ObjectId


const dbNAme = 'task_manager'

async function main() {
    await client.connect()
    console.log('Connected successfully to server!')

    const db = client.db(dbNAme)
    const collection = db.collection('tasks')

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally((() => client.close()))


















