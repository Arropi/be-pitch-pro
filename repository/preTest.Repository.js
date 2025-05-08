const prisma = require('../services/connection')

const insertUserProgress = async (story_id, user_id) => {
    const createdUserProgress = await prisma.user_progress.create({
        data: {
          story_id: story_id,
          user_id: user_id,
        }
    })
    return createdUserProgress
}

const insertPreTestUser = async (anxiety_level, anxiety_reason, progress_id) => {
    const createdUserPreTest = await prisma.pre_test.create({
        data:{
            progress_id: progress_id,
            anxiety_level: anxiety_level,
            anxiety_reason: anxiety_reason
        }
    })
    return createdUserPreTest
}

const checkPreTest = async (progressId) => {
    const dataUser = await prisma.pre_test.findFirst({
        where: {
            progress_id: progressId
        }
    })
    return dataUser
}

const updatePreTest = async (anxiety_level, anxiety_reason, pre_test_id) => {
    const dataUpdated = await prisma.pre_test.update({
        data: {
            anxiety_level: anxiety_level,
            anxiety_reason: anxiety_reason
        },
        where:{
            pre_test_id: pre_test_id
        }
    })
    return dataUpdated
}

module.exports = {
    insertUserProgress,
    insertPreTestUser,
    checkPreTest,
    updatePreTest
}