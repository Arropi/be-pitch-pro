const { Prisma } = require('@prisma/client')
const prisma = require('../services/connection')

const getUserDetailProgress = async (progressId) => {
    const data = await prisma.user_detail.findFirst({
        select: {
            progress_id: true,
            history_xp: true
        },
        where:{
            progress_id: progressId
        },
        orderBy: {
            times: 'desc'
        }
    })
    return data
}

module.exports = {
    getUserDetailProgress
}