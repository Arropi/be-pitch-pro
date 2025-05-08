const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const route = express.Router()
const { z, ZodError } = require('zod')
const { postUserProgress } = require('../services/preTestService')
const { postUserPostTest, updateUserPostTest } = require('../services/postTestService')
const { findProgressUserInStory } = require('../repository/postTestRepository')


route.use(authorizeToken)

route.post('/:story_id', async (req,res) =>{
    try {
        const story_id = req.params.story_id
        const {user_id} = req.user.getUser
        const {anxiety_level, anxiety_reason} = req.body
        const anxietyLevelUser = z.number({required_error: "Should have the anxiety level"}).int('Must be integer data type').parse(anxiety_level)
        const anxietyReasonUser = z.string({required_error: "Should have the anxiety reason"}).parse(anxiety_reason)
        const inputDataPostTest = await postUserPostTest(story_id, user_id, anxietyLevelUser, anxiety_reason) 
        return res.status(201).json({
            "message": "Post Test Submitted",
            "data": inputDataPostTest
        })
    } catch (error) {
        if (error instanceof ZodError){
            res.status(403).json({"message": error.errors[0].message})
        } else {
            res.status(400).json({"message": error.message})
        }
    }
})

route.put('/:story_id', async (req, res) => {
    try {
        const story_id = req.params.story_id
        const {user_id} = req.user.getUser
        const {anxiety_level, anxiety_reason} = req.body
        const updated = await updateUserPostTest(story_id, user_id, anxiety_level, anxiety_reason)
        return res.status(200).json({
            "message": "Updated Succesfully",
            "data": updated
        })
    } catch (error) {
        return res.status(400).json({
            "message": error.message
        })        
    }
})

module.exports = route