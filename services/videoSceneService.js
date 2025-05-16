const { getUrlVideo } = require("../repository/videoSceneRepository")

const videoUrlGCloud = async (filename) => {
    const bucketName = 'assets-pitchpro' 
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, 
    }
    const videoUrl = await getUrlVideo(bucketName, filename, options)
    return videoUrl
}

module.exports = {
    videoUrlGCloud
}