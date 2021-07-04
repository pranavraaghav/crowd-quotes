const { DataTypes } = require('sequelize')
const db = require('../database/connection')

const schema = {
    quoteId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false, 
        references: {
            model: 'Users',
            key: 'userId'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,         
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
}

const options = {
    timestamps: true
}

const Quote = db.define('Quote', schema, options)

module.exports = Quote