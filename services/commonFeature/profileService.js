const { getXpInLastWeek, getBadgeUser } = require("../../repository/commonFeature/profileRepository")

const getDataProfile = async (userId) => {
    const xp = await getXpInLastWeek(parseInt(userId))
    const badge = await getBadgeUser(parseInt(userId))
    const data = {
        xp,
        badge
    }
    return data
}

module.exports = {
    getDataProfile
}