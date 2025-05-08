const prisma = require('../../services/connection')

const getXpInLastWeek = async (userId) => {
    const data = await prisma.$queryRaw`
    SELECT 
    SUM(history_xp)::int AS xp, 
    times::date AS date
  FROM user_detail
  WHERE user_id = ${userId}
    AND times::date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
  GROUP BY times::date
  ORDER BY times::date;`
  console.log(data)
    return data
}

const getBadgeUser = async (userId) => {
    const userBadge = await prisma.$queryRaw`
    SELECT badge.badge_name, badge.badge_id
    FROM user_detail
    JOIN badge ON user_detail.badge_id = badge.badge_id
    WHERE user_detail.user_id = ${userId}
    GROUP BY badge.badge_id, badge.badge_name`
    return userBadge
}

module.exports = {
    getXpInLastWeek,
    getBadgeUser
}