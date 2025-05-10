const express = require('express')
const authorizeToken = require('../../services/middleAuthorization')
const { getBadgeData } = require('../../services/commonFeature/badgeService')
const route = express.Router()

route.use(authorizeToken)

route.get('/:badge_id', async (req,res) => {
    try {
        const badgeId = req.params.badge_id
        const getDataBadge = await getBadgeData(badgeId)
        return res.status(200).json({
            "message": "Getting Badge Succesfully",
            "data" : getDataBadge
        })
    } catch (error) {
        return res.status(400).json({
            "error": error.message
        })
    }
})

module.exports = route