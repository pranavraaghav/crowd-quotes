const express = require('express')

const db = require('./database/connection')
const routes = require('./routes')
const quotes = require('./routes/quotes.js')
const users = require('./routes/users.js')

const app = express()

// Migrations 
const { migrations } = require('./models/migrations')
migrations()
.then(() => { console.log('Migrations made')})
.catch(err => {
    console.log('Error while migrating')
    console.log(err.toString())
    process.exit(2)
})

// Database connection test 
db.authenticate().then(() => {
    console.log('Connected to database')
}).catch(err => {
    console.log('Error connecting to DB')
    process.exit(2)
})

// Middlewares 
app.use(express.json())

// Mount routes
app.use('/', routes)
app.use('/api/v1/user', users)
app.use('/api/v1/quote', quotes)

module.exports = app