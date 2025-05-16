const{Storage} = require('@google-cloud/storage');
const gCloud = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const storage = new Storage({
    credentials: gCloud
})



const getUrlVideo = async (bucketName, fileName, options) => {
    const [url] = await storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);
    return url
}
module.exports = {
    getUrlVideo
}