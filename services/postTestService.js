const { findProgressUserInStory, insertUserPostTest } = require("../repository/postTestRepository")

const postUserPostTest = async (story_id, user_id, anxiety_level, anxiety_reason) => {
    const userProgress = await findProgressUserInStory(parseInt(user_id), parseInt(story_id))
    if (userProgress === null ){
        throw Error("Sorry, to do this you need to pre test first")
    }
    const progress_id = userProgress.progress_id
    const postUserPreTest = await insertUserPostTest(anxiety_level, anxiety_reason, progress_id)
    return postUserPreTest
}

module.exports = {
    postUserPostTest
}