const { date } = require("zod")
const { findUser } = require("../../repository/authRepository")
const { GetScenarioByChapter, GetUserById, GetUserProgress } = require("../../repository/commonFeature/storiesRepository")
const { checkPreTest } = require("../../repository/preTest.Repository")
const { checkPostTest, findProgressUserInStory } = require("../../repository/postTestRepository")
const { getDetailProgress } = require("../../repository/challengeFeedbackRepository")

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
    const preTest = []
    const postTest = []
    const feedback = []
    const storyIdProgress = []
    listProgress.forEach(function(storyId, index){
        storyIdProgress.push(storyId.story_id)

    })
    const result = []
    console.log(allScenario)
    for(const data of allScenario){
        let resultAkhir = {
            ...data,
            "is_pre-test": storyIdProgress.includes(data.story_id)? true: false
        }
        if (resultAkhir["is_pre-test"] === false) {
            resultAkhir = {
                ...resultAkhir,
                "is_post-test": false,
                "is_generated": false
            }
            result.push(resultAkhir)
        } else {
            const { progress_id } = await findProgressUserInStory(userId, data.story_id)
            var generated = await getDetailProgress(progress_id)
            if (generated) {
                generated = Boolean(generated.audio)
            } else {
                generated = false
            }
            resultAkhir = {
                ...resultAkhir,
                "is_post-test": await checkPostTest(progress_id)? true: false,
                "is_generated": generated
            }
            result.push(resultAkhir)
        }
    }
    
    return result
}

module.exports ={
    UserXp,
    ScenarioList
}