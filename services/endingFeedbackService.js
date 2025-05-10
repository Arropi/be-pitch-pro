const { GetScenarioByChapter, GetUserProgress } = require("../repository/commonFeature/storiesRepository")
const { getUserDetailProgress } = require("../repository/endingFeedbackRepository")
const { findProgressUserInStory } = require("../repository/postTestRepository")

const getUserHistory = async (userId, chapter) => {
    userId = parseInt(userId)
    chapter = parseInt(chapter)
    const dataStory = await GetScenarioByChapter(chapter)
    const listStory = []
    const userHistory = []
    dataStory.forEach(element => {
        listStory.push(element.story_id)
    });
    for (const element of listStory) {
        const data = await findProgressUserInStory(userId, element)
        if (data){
            let jsonTemp = await getUserDetailProgress(data.progress_id)
            if (jsonTemp){
                jsonTemp = {
                    ...jsonTemp,
                    "story_id": element
                }
                userHistory.push(jsonTemp)
            }
        }
    }
    
    return userHistory
}


module.exports = {
    getUserHistory
}