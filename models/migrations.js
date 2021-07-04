exports.migrations = async () => {
    try {
        const User = require('./user')
        const Quote = require('./quote')

        Quote.belongsTo(User, { foreignKey: 'userId' })

        await User.sync({ alter: true })
        await Quote.sync({ alter: true })
    } catch (error) {
        throw new Error(error)
    }
}