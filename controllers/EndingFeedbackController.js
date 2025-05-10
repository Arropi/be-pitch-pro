require('dotenv').config()
const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const { getUserHistory } = require('../services/endingFeedbackService')
const route = express.Router()

route.use(authorizeToken)

route.get('/:chapter', async (req, res) => {
    try {
        const chapter = req.params.chapter
        const {user_id} = req.user.getUser
        const dataEnding = await getUserHistory(user_id, chapter)
        return res.status(200).json({
            "message": "Getting Ending Succesfully",
            "data": dataEnding
        })
    } catch (error) {
        res.status(400).json({
            "error": error.message
        })
    }
})

module.exports = route