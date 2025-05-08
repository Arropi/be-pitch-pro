const prisma = require('../../services/connection')

const GetUserById = async (user_id) => {
    const data = await prisma.users.findUnique({
        where:{
          user_id: user_id
        }
      })
      return data
}
const GetScenarioByChapter = async (chapter) => {
    const scenario = await prisma.stories.findMany({
        where: {
          chapter: chapter
        }
    })
    return scenario
}

const GetUserProgress = async (userId) => {
  console.log(userId)
  const dataProgress = await prisma.user_progress.findMany({
    select: {
      story_id: true
    },
    where:{
      user_id: userId
    }
  })
  return dataProgress
}

module.exports = {
    GetUserById,
    GetScenarioByChapter,
    GetUserProgress
}