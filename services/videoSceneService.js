const{Storage} = require('@google-cloud/storage');
const gCloud = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const storage = new Storage({
    credentials: gCloud
})

const { getUrlVideo } = require("../repository/videoSceneRepository");


const videoUrlGCloud = async () => {
    const bucketName = 'assets-pitchpro' 
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, 
    }
    const [files] = await storage.bucket(bucketName).getFiles();
    const fileNames = files.map(file => file.name);
    console.log(fileNames)
    const allUrlFiles = []
    for(const name of fileNames ){
        const videoUrl = await getUrlVideo(bucketName, name, options)
        const data = {
            "fileName" : name,
            videoUrl
        }
        allUrlFiles.push(data)
    }

    return allUrlFiles
}

module.exports = {
    videoUrlGCloud
}