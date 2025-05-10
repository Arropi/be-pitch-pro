const prisma = require('../../services/connection')

const getBadge = async (badgeId) => {
    const badge = await prisma.badge.findUnique({
        where: {
            badge_id: badgeId
        }
    })
    return badge
}

module.exports = {
    getBadge
}