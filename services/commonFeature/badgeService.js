const { getBadge } = require("../../repository/commonFeature/badgeRepository")

const getBadgeData  = async (badgeId) => {
    badgeId = parseInt(badgeId)
    const data = await getBadge(badgeId)
    return data
}

module.exports = {
    getBadgeData
}