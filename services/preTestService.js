const { findProgressUserInStory } = require("../repository/postTestRepository")
const { insertUserProgress, insertPreTestUser, checkPreTest, updatePreTest } = require("../repository/preTest.Repository")

const postUserProgress = async (story_id, user_id, anxiety_level, anxiety_reason) => {
    const checkUserProgress = await findProgressUserInStory(parseInt(user_id), parseInt(story_id))
    if (checkUserProgress){
        throw Error('this user has done a pre-test, can only update')
    }
    const userProgress = await insertUserProgress(parseInt(story_id), parseInt(user_id))
    const progress_id = userProgress.progress_id
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