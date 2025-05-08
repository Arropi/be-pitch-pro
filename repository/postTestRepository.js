const prisma = require('../services/connection')

const findProgressUserInStory = async (user_id, story_id) => {
    const userProgress = await prisma.user_progress.findFirst({
        where: {
            AND :[
                {story_id: story_id},
                {user_id: user_id}
            ]
        },
        orderBy: {
            time_do: 'desc'
        }
    })
    return userProgress
}

const insertUserPostTest = async (anxiety_level, anxiety_reason, progress_id) => {
    const createdUserPostTest = await prisma.post_test.create({
        data: {
            progress_id: progress_id,
            anxiety_level: anxiety_level,
            anxiety_reason: anxiety_reason
        }
    })
    return createdUserPostTest
}

const checkPostTest = async (progressId) => {
    const dataUser = await prisma.post_test.findFirst({
        where: {
            progress_id: progressId
        }
    })
    return dataUser
}

module.exports = {
    findProgressUserInStory,
    insertUserPostTest,
    checkPostTest
}