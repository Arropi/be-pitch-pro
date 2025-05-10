require('dotenv').config()
const {GoogleGenAI, Type} =  require('@google/genai');
const { getDetailStory, saveDetailProgress, getDetailProgress, saveFeedback, updateDetailProgress, updateAudioProgress, saveUserDetail, updateUserInformation } = require('../repository/challengeFeedbackRepository');
const { findProgressUserInStory } = require('../repository/postTestRepository');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getValidation = async (storyId, userId, audio) => {
    const getStoryInformation = await getDetailStory(parseInt(storyId))
    const {progress_id} = await findProgressUserInStory(parseInt(userId), parseInt(storyId))
    const systemInstruction = getStoryInformation.system_instruction
    const generateValidation = await ai.models.generateContent({ 
        model: "gemini-2.5-flash-preview-04-17",
        contents: [
            {
                inlineData: {
                    mimeType: audio.mimetype,
                    data: audio.buffer.toString("base64"),
                }
            }
        ],
        config: {
            systemInstruction:systemInstruction,
            maxOutputTokens: 400,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    'result': {
                    type: Type.BOOLEAN,
                    nullable:false,
                    }
                }
            }
        }
    })
    let nextScene = JSON.parse(generateValidation.text)
    const progressUser = await getDetailProgress(progress_id)
    if (progressUser === null) {
        const saveProgress = await saveDetailProgress(progress_id, audio.buffer)
        const data = {...nextScene, ...saveProgress}
        console.log(data)
        return data
    } else if (progressUser.audio !== null){
        const saveProgress = await updateAudioProgress(progress_id, audio.buffer)
        const data = {...nextScene, ...saveProgress}
        console.log(data)
        return data
    }
}

const getMetrics = async (storyId, userId) => {
    const {progress_id} = await findProgressUserInStory(parseInt(userId), parseInt(storyId))
    const dataAudio = await getDetailProgress(progress_id)
    const buffer = Buffer.from(dataAudio.audio)
    const generateMetrics = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {text: "Analyze this audio"},
            {
            inlineData: {
                mimeType: "audio/ogg",
                data: buffer.toString("base64"),
            }
            }
        ],
        config: {
            systemInstruction:`You are a presentation analyzer. Evaluate the presentation based on the following aspects and provide a concise analysis in a listed format:
        Pace (Give it word per minute overall)
        Intonation (Give it rate 1 to 100)
        
        Articulation (Give it rate 1 to 100)
        Word Choice (Give it filler word)
        At the end, give overall rating for the speakers based on analysis
        
        Example Output Format:
        
        Pace: 5
        Intonation: 1
        Articulation: 4
        Word Choice: Give the filler word.
        Overall: 7.8`,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    'metrics': {
                    type: Type.OBJECT,
                    nullable: false,
                    properties: {
                        'pace': {
                            type: Type.INTEGER,
                            nullable: false,
                            description: 'rate wpm from the evaluation for the speakers'
                        },
                        'intonation': {
                            type: Type.INTEGER,
                            nullable: false,
                            description: 'rate intonation from the evaluation for the speakers'
                        },
                        'articulation': {
                            type: Type.INTEGER,
                            nullable: false,
                            description: 'rate articulation from the evaluation for the speakers'
                        },
                        'word-choice': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'word choice that being filler word'
                        },
                        'overall': {
                            type: Type.NUMBER,
                            nullable: false,
                            description: 'rate overall from the evaluation for the speakers'
                        }
                    },
                    required: ["pace", "intonation", "articulation", "word-choice", "overall"]
                    }
                }
            }
        }
    })
    console.log(generateMetrics.text)
    const metrics = JSON.parse(generateMetrics.text)
    return metrics
}

const getTimeSeries = async (storyId, userId) => {
    const {progress_id} = await findProgressUserInStory(parseInt(userId), parseInt(storyId))
    const dataAudio = await getDetailProgress(progress_id)
    const buffer = Buffer.from(dataAudio.audio)
    const generateTimeSeries = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {text: "Analyze this audio"},
            {
            inlineData: {
                mimeType: "audio/ogg",
                data: buffer.toString("base64"),
            }
            }
        ],
        config: {
            systemInstruction:`You are a audio analyzer. Evaluate the audio from user based on the following aspects and provide a concise analysis in a listed format
        Example Output Format:
{
    timeSeries: [
        { time: '5s', wpm: 130, intonation: 65, volume: 72 },
        { time: '10s', wpm: 140, intonation: 70, volume: 68 },
        { time: '15s', wpm: 155, intonation: 82, volume: 75 },
        { time: '20s', wpm: 148, intonation: 78, volume: 70 },
        { time: '25s', wpm: 135, intonation: 60, volume: 65 },
        { time: '30s', wpm: 160, intonation: 85, volume: 77 },
        { time: '35s', wpm: 142, intonation: 72, volume: 71 },
      ],
}
  every 5 second interval all aspect needed time wpm intonation and volume`,
            temperature: 0.2,
            maxOutputTokens: 700,
        }
    })
    const cleanedText = generateTimeSeries.text.replace("```json", '').replace("```", '');
    const timeSeries = JSON.parse(cleanedText)
    return timeSeries
}

const getFeedback = async (storyId, userId) => {
    userId = parseInt(userId)
    storyId = parseInt(storyId)
    const {progress_id} = await findProgressUserInStory(userId, parseInt(storyId))
    const detailProgress = await getDetailProgress(progress_id)
    if(detailProgress.audio === null) {
        throw Error("Please do the post audio first!")
    }
    if (detailProgress.history_feedback !== null){
        const dataTimeSeries ={  
            "timeSeries" : detailProgress.history_feedback.dataFeedback.timeSeries
        }
        const dataFeedback = detailProgress.history_feedback.dataFeedback
        const timeSeries = []
        for (const data of dataTimeSeries.timeSeries) timeSeries.push(data);
        const cleanDataFeedback = {
            ...dataFeedback,
            "timeSeries": timeSeries
        }
        console.log(cleanDataFeedback)
        const history_feedback = {
            ...detailProgress.history_feedback,
            "dataFeedback": cleanDataFeedback
        }
        console.log(history_feedback)
        return history_feedback
    } else {
        const { badge_id } = await getDetailStory(storyId)
        const dataMetrics = await getMetrics(storyId, userId)
        const accumulateXp = dataMetrics.metrics.overall * 20
        const dataTimeSeries = await getTimeSeries(storyId, userId)
        const dataFeedback = {
          "metrics": dataMetrics.metrics,
          "timeSeries": dataTimeSeries.timeSeries
        }
        const allData = {
            dataFeedback,
            "badge": badge_id
        }
        const savedFeedback = await updateDetailProgress(progress_id, allData, accumulateXp)
        const savedUserDetail = await saveUserDetail(userId, accumulateXp, badge_id)
        const updatedUser = await updateUserInformation(userId, accumulateXp)
        return allData
    }
}

const updateFeedback = async (storyId, userId, audio) => {
    storyId = parseInt(storyId)
    userId = parseInt(userId)
    const { badge_id } = await getDetailStory(storyId)
    const {progress_id} = await findProgressUserInStory(userId, storyId)
    const detailProgress = await getDetailProgress(progress_id)
    if (detailProgress.history_feedback == null){
        throw Error("Get the feedback first")
    } else {
        const validation = await getValidation(storyId, userId, audio)
        const dataMetrics = await getMetrics(storyId, userId)
        const accumulateXp = dataMetrics.metrics.overall * 20
        const dataTimeSeries = await getTimeSeries(storyId, userId)
        const dataFeedback = {
          "metrics": dataMetrics.metrics,
          "timeSeries": dataTimeSeries.timeSeries
        }
        const allData = {
            dataFeedback,
            "badge": badge_id
        }
        const savedFeedback = await updateDetailProgress(progress_id, allData, accumulateXp)
        const savedUserDetail = await saveUserDetail(userId, accumulateXp, badge_id)
        const updatedUser = await updateUserInformation(userId, accumulateXp)
        return validation
    }
}

module.exports = {
    getValidation,
    getMetrics,
    getTimeSeries, 
    getFeedback,
    updateFeedback
}