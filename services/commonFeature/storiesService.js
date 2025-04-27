const { findUser } = require("../../repository/authRepository")
const { GetScenarioByChapter, GetUserById } = require("../../repository/commonFeature/storiesRepository")

const UserXp = async (user_id) => {
    user_id = parseInt(user_id)
    const user_data = await GetUserById(user_id)
    const user_xp = user_data.xp
    return user_xp
}

const ScenarioList = async (chapter) => {
    chapter = parseInt(chapter)
    const allScenario = await GetScenarioByChapter(chapter)
    return allScenario
}

module.exports ={
    UserXp,
    ScenarioList
}