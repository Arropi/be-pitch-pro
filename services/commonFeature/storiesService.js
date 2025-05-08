const { date } = require("zod")
const { findUser } = require("../../repository/authRepository")
const { GetScenarioByChapter, GetUserById, GetUserProgress } = require("../../repository/commonFeature/storiesRepository")

const UserXp = async (user_id) => {
    user_id = parseInt(user_id)
    const user_data = await GetUserById(user_id)
    const user_xp = user_data.xp
    return user_xp
}

const ScenarioList = async (chapter, userId) => {
    chapter = parseInt(chapter)
    userId = parseInt(userId)
    const allScenario = await GetScenarioByChapter(chapter)
    var listProgress = await GetUserProgress(userId)
    const storyIdProgress = []
    listProgress.forEach(function(storyId, index){
        storyIdProgress.push(storyId.story_id)
    })
    const dataStatus = allScenario.map(story =>({
        ...story,
        "status": storyIdProgress.includes(story.story_id)? "unlocked": "locked"
    }))
    return dataStatus
}

module.exports ={
    UserXp,
    ScenarioList
}