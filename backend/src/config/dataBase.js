const mongoose = require('mongoose')
require('dotenv').config()

const login = process.env.LOGIN
const password = process.env.PASSWORDs
const db = `mongodb+srv://${login}:${password}@cluster0.pirt6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(db)
.then(question => console.log('connect db'))
.catch(error => console.log(error))
