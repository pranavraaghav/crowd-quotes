import * as express from "express";

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({message: 'API works'})
})

module.exports = router