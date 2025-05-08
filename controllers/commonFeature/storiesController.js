const express = require('express')
const authorizeToken = require('../../services/middleAuthorization')
const route = express.Router()

const { UserXp, ScenarioList } = require("../../services/commonFeature/storiesService")

route.use(authorizeToken)
route.get('/:chapter',  async(req, res)=>{
    try {
      const {user_id} = req.user.getUser
      const xp = await UserXp(user_id)
      const stories = await ScenarioList(req.params.chapter, user_id)
      return res.status(200).json({
        "message": "Getting Stories Successfull",
        "xp": xp,
        "data": stories
      })
    } catch (err) {
      res.status(400).json({
        "message": err.message
      })
    }
})

module.exports = route