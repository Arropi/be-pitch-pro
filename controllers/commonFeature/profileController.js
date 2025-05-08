const express = require('express')
const authorizeToken = require('../../services/middleAuthorization')
const { UserXp } = require('../../services/commonFeature/storiesService')
const { getDataProfile } = require('../../services/commonFeature/profileService')
const route = express.Router()


route.use(authorizeToken)

route.get('/xp', async (req, res) => {
    try {
        const {user_id} = req.user.getUser
        const getXp = await UserXp(user_id)
        return res.status(200).json({
            "xp": getXp
        })
    } catch (error) {
        return res.status(400).json({
            "error": error.message
        })   
    }
})

route.get('/profile', async (req, res)=>{
    try {
        const {user_id} = req.user.getUser
        const datas = await getDataProfile(user_id)
        return res.status(200).json({
            "message": "Getting data successfully",
            datas
        })
    } catch (error) {
        return res.status(400).json({
            "message": error.message
        })
    }
})

module.exports = route