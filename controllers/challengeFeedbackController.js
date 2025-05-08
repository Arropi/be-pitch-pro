require('dotenv').config()
const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const route = express.Router()
const multer = require('multer')
const upload = multer()
const {GoogleGenAI, Type} =  require('@google/genai')
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prisma = require('../services/connection')
const { getValidation, getMetrics, getTimeSeries, getFeedback, updateFeedback } = require('../services/challengeFeedbackService')

route.use(authorizeToken)

route.post('/:story_id', upload.single('audio'), async (req, res) =>{
    try {
      const {user_id} = req.user.getUser
      const story_id = req.params.story_id 
      const file = req.file
      const validation = await getValidation(story_id,user_id, file)
  
  
      return res.status(201).json({
        "message": "Analyze succesful",
        "result": validation.result
      })
    } catch (error) {
      return res.status(400).json({
        'message': error.message
      })
    }
})

route.get('/:story_id', async (req, res) =>{
  try {
    const story_id = req.params.story_id
    const { user_id } = req.user.getUser
    const data = await getFeedback(story_id,user_id)
    return res.status(200).json({
      "message": "Getting Challenge Feedback Succesfully",
      "data": data
    })
  } catch (error) {
    return res.status(400).json({
      "error": error.message
    })    
  }
})

route.put('/:story_id', upload.single('audio'), async (req, res) => {
  try {
    const story_id = req.params.story_id
    const { user_id } = req.user.getUser
    const file = req.file
    const data = await updateFeedback(story_id,user_id,file)
    return res.status(200).json({
      "message": "Update Succesfully",
      "data": data.result
    })
  } catch (error) {
    return res.status(400).json({
      "error": error.message
    })
  }
})

module.exports = route