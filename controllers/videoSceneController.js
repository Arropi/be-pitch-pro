require('dotenv').config()
const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const route = express.Router()
const{Storage} = require('@google-cloud/storage')
const { videoUrlGCloud } = require('../services/videoSceneService')
const gCloud = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const storage = new Storage({
    credentials: gCloud
})

route.use(authorizeToken)

route.get('/', async (req, res) => {
    try {
        const url = await videoUrlGCloud()
        res.status(200).json({
            "message": `Getting All URL Video Succesfully`, 
            url 
        });
    } catch (err) {
        console.error('Error generating signed URL:', err);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
    

})

module.exports = route