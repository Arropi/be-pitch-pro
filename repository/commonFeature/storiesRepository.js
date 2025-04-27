const prisma = require('../../services/connection')

const GetUserById = async (user_id) => {
    const xp = await prisma.users.findUnique({
        where:{
          user_id: user_id
        }
      })
      return xp
}
const GetScenarioByChapter = async (chapter) => {
    const scenario = await prisma.stories.findMany({
        where: {
          chapter: chapter
        }
    })
    return scenario
}

module.exports = {
    GetUserById,
    GetScenarioByChapter
}