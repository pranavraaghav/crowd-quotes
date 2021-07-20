const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
    const tokenHeader = req.header('Authorization')
    if(!tokenHeader) {
        const response = {
            error: true, 
            message: "Access denied",
            code: 401
        }
        return res.status(response.code).send(response)
    }
    // tokenHeader exists
    try {
        const token = tokenHeader.split(' ')[1]
        req.decoded = jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (error) {
        const response = {
            error: true,
            message: 'Token is invalid',
            code: 400
        }
        res.status(response.code).send(response)
    }
}

module.exports = isLoggedIn;