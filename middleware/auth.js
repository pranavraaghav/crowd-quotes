const jwt = require('jsonwebtoken')

module.exports = isLoggedIn = (req, res, next) => {
    const tokenHeader = req.header('Authorization')
    console.log(tokenHeader)
    if(!tokenHeader) {
        console.log('access denied')
        const response = {
            error: true, 
            message: "Access denied",
            code: 401
        }
        return res.status(response.code).send(response)
    }
    // tokenHeader exists
    try {
        const token = tokenHeader
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