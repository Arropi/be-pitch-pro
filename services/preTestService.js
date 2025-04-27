const { findProgressUserInStory } = require("../repository/postTestRepository")
const { insertUserProgress, insertPreTestUser } = require("../repository/preTest.Repository")

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

module.exports = {
    postUserProgress
}