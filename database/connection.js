const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize('crowd-quotes', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host:'192.168.0.117'
})

module.exports = sequelize