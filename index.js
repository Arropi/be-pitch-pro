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
const Badge = require('./controllers/commonFeature/badgeController')
const Video = require('./controllers/videoSceneController')
const port = process.env.PORT
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  next();
});

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))



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

app.use('/badge', Badge)

app.use('/ending-feedback', EndingFeedback)

app.use('/media', Video)

app.listen(port, ()=>{
  console.log(`Server menyala pada port ${port}`)
})