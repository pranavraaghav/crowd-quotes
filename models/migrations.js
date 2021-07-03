exports.migrations = async () => {
    try {
        const User = require('./user')

        await User.sync({ alter: true })
    } catch (error) {
        throw new Error(error)
    }
}