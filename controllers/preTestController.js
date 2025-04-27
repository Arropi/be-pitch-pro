const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const route = express.Router()
const { z, ZodError } = require('zod')
const { postUserProgress } = require('../services/preTestService')


route.use(authorizeToken)

route.post('/:story_id', async (req,res) =>{
    try {
        console.log('Masukk')
        const story_id = req.params.story_id
        const {user_id} = req.user.getUser
        const {anxiety_level, anxiety_reason} = req.body
        const anxietyLevelUser = z.number({required_error: "Should have the anxiety level"}).int('Must be integer data type').parse(anxiety_level)
        const anxietyReasonUser = z.string({required_error: "Should have the anxiety reason"}).parse(anxiety_reason)
        const inputDataPreTest = await postUserProgress(story_id, user_id, anxietyLevelUser, anxiety_reason) 

        return res.status(201).json({
            "message": "Pre Test have been submitted",
            "data": inputDataPreTest
        })
    } catch (error) {
        if (error instanceof ZodError){
            res.status(400).json({"message": error.errors[0].message})
        } else {
            res.status(400).json({"message": error.message})
        }
    }
})

module.exports = route