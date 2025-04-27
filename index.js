require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const upload = multer()
const jwt = require('jsonwebtoken')
const prisma = require('./services/connection')
const { z } = require('zod')
const MiddlleAuthorize = require('./services/middleAuthorization')
const AuthController = require('./controllers/authController')
const PostProgress = require('./controllers/postTestController')
const PreProgress = require('./controllers/preTestController')
const AllScenario = require('./controllers/commonFeature/storiesController') 
const ChallengeFeedback = require('./controllers/challengeFeedbackController')
const port = process.env.PORT


app.use(cors())
app.use(express.json())

const {GoogleGenAI, Type} =  require('@google/genai')
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


app.get('/', (req,res)=>{
    res.json({
        "message": "Hello World"
    })
})

app.use('/', AuthController)

app.use('/stories', AllScenario )

app.use('/pre-test', PreProgress)

app.use('/post-test', PostProgress)

app.use('/generate', ChallengeFeedback)




app.listen(port, ()=>{
  console.log(`Server menyala pada port ${port}`)
})