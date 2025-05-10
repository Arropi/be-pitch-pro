require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const AuthController = require('./controllers/authController')
const PostProgress = require('./controllers/postTestController')
const PreProgress = require('./controllers/preTestController')
const AllScenario = require('./controllers/commonFeature/storiesController') 
const ChallengeFeedback = require('./controllers/challengeFeedbackController')
const User = require('./controllers/commonFeature/profileController')
const EndingFeedback = require('./controllers/EndingFeedbackController')
const port = process.env.PORT


app.use(cors())
app.use(express.json())


app.get('/', (req,res)=>{
    res.json({
        "message": "Hello World!"
    })
})

app.use('/', AuthController)

app.use('/stories', AllScenario )

app.use('/pre-test', PreProgress)

app.use('/post-test', PostProgress)

app.use('/generate', ChallengeFeedback)

app.use('/user', User)

app.use('/ending-feedback', EndingFeedback)

app.listen(port, ()=>{
  console.log(`Server menyala pada port ${port}`)
})