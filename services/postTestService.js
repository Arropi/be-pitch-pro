const { findProgressUserInStory, insertUserPostTest, checkPostTest, updatePostTest } = require("../repository/postTestRepository")

const postUserPostTest = async (story_id, user_id, anxiety_level, anxiety_reason) => {
    const userProgress = await findProgressUserInStory(parseInt(user_id), parseInt(story_id))
    if (userProgress === null ){
        throw Error("Sorry, to do this you need to pre test first")
    }
    const progress_id = userProgress.progress_id
    const postUserPreTest = await insertUserPostTest(anxiety_level, anxiety_reason, progress_id)
    return postUserPreTest
}

const updateUserPostTest = async (storyId, userId, anxiety_level, anxiety_reason) => {
    storyId = parseInt(storyId)
    userId = parseInt(userId)
    const {progress_id} = await findProgressUserInStory(userId, storyId)
    const {post_test_id} = await checkPostTest(progress_id)
    const updated = await updatePostTest(anxiety_level,anxiety_reason,post_test_id)
    return updated
}

module.exports = {
    postUserPostTest,
    updateUserPostTest
}