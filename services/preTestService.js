const { findProgressUserInStory } = require("../repository/postTestRepository")
const { insertUserProgress, insertPreTestUser, checkPreTest, updatePreTest, getStoryPack, getPackage } = require("../repository/preTest.Repository")

const postUserProgress = async (story_id, user_id, anxiety_level, anxiety_reason) => {
    const checkUserProgress = await findProgressUserInStory(parseInt(user_id), parseInt(story_id))
    if (checkUserProgress){
        const userPreTest = await checkPreTest(checkUserProgress.progress_id)
        if (userPreTest){
            throw Error('this user has done a pre-test, can only update')
        }
    }
    const {checkpoint_pack} = await getPackage(parseInt(story_id))
    const dataStory = []
    const story = await getStoryPack(checkpoint_pack)
    story.forEach((element) =>{
        dataStory.push(element.story_id)
    })
    dataStory.forEach(async (storyId)=>{
        const userProgress = await insertUserProgress(parseInt(storyId), parseInt(user_id))
    })
    const {progress_id} = await findProgressUserInStory(parseInt(user_id), parseInt(story_id))
    const postUserPreTest = await insertPreTestUser(anxiety_level, anxiety_reason, progress_id)
    return postUserPreTest
}

const updateUserPreTest = async (storyId, userId, anxiety_level, anxiety_reason) => {
    storyId = parseInt(storyId)
    userId = parseInt(userId)
    const {progress_id} = await findProgressUserInStory(userId, storyId)
    const {pre_test_id} = await checkPreTest(progress_id)
    const updated = await updatePreTest(anxiety_level, anxiety_reason, pre_test_id)
    return updated
}

module.exports = {
    postUserProgress,
    updateUserPreTest
}