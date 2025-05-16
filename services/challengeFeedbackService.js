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
        model: "gemini-2.0-flash",
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
    const result = generateValidation.text
    console.log(result)
    let nextScene = JSON.parse(result)
    const progressUser = await getDetailProgress(progress_id)
    if (progressUser === null) {
        console.log(audio.buffer)
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
                mimeType: "audio/wav",
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

const getImprovement = async (storyId, userId) => {
    const {progress_id} = await findProgressUserInStory(parseInt(userId), parseInt(storyId))
    const dataAudio = await getDetailProgress(progress_id)
    const buffer = Buffer.from(dataAudio.audio)
    const generateImprovement = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {text: "Analyze this audio"},
            {
            inlineData: {
                mimeType: "audio/wav",
                data: buffer.toString("base64"),
            }
            }
        ],
        config: {
            systemInstruction:`You are a presentation analyzer. Your task is to evaluate a presentation based on the following aspects and return a concise analysis in a listed format. For each aspect, provide specific suggestions for improvement (maximum 50 words each). At the end, include a brief motivational critique.

Evaluation Aspects:

Pace: Suggest improvements for the speaker’s speaking speed. (Max 50 words)

Intonation: Suggest improvements for the speaker’s vocal variety and expression. (Max 50 words)

Articulation: Suggest improvements on how clearly the speaker pronounces words. (Max 50 words)

Word Choice: Suggest improvements regarding vocabulary, clarity, and filler words. (Max 50 words)

Overall: Provide an overall critique and field of improvement for the speaker, ending with a motivational message. (Max 50 words)

Example Output Format:        
Pace: Try to maintain a more consistent speed, avoiding sudden rushes. Pausing after key points may help the audience follow along better.
Intonation: Vary your tone more to emphasize important parts. This will help maintain listener interest and convey confidence.
Articulation: Focus on pronouncing each word clearly, especially at the end of sentences. This will boost understanding and professionalism.
Word Choice: Avoid filler words like "um" and "you know." Practice with short pauses instead to maintain fluency and control.
Overall: Great effort! With better pacing and clarity, your message will shine. Keep practicing—you’re on the right track!
`,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    'improvement': {
                    type: Type.OBJECT,
                    nullable: false,
                    properties: {
                        'pace': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'Suggest improvements for the speaker’s speaking speed. (Max 50 words)'
                        },
                        'intonation': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'Suggest improvements for the speaker’s vocal variety and expression. (Max 50 words)'
                        },
                        'articulation': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'Suggest improvements on how clearly the speaker pronounces words. (Max 50 words)'
                        },
                        'word-choice': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'Suggest improvements regarding vocabulary, clarity, and filler words. (Max 50 words)'
                        },
                        'overall': {
                            type: Type.STRING,
                            nullable: false,
                            description: 'Provide an overall critique and field of improvement for the speaker, ending with a motivational message. (Max 50 words)'
                        }
                    },
                    required: ["pace", "intonation", "articulation", "word-choice", "overall"]
                    }
                }
            }
        }
    })
    console.log(generateImprovement.text)
    const metrics = JSON.parse(generateImprovement.text)
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
                mimeType: "audio/wav",
                data: buffer.toString("base64"),
            }
            }
        ],
        config: {
            systemInstruction:`You are a audio analyzer. Evaluate the audio from user based on the following aspects and provide a concise analysis in a listed format
Example Output Format JSON:
{
    "timeSeries": [
        { "time" : "5s", "wpm": 130, "intonation": 65, "articulation": 72 },
        { "time" : "10s", "wpm": 140, "intonation": 70, "articulation": 68 },
        { "time" : "15s", "wpm": 155, "intonation": 82, "articulation": 75 },
        { "time" : "20s", "wpm": 148, "intonation": 78, "articulation": 70 },
        { "time" : "25s", "wpm": 135, "intonation": 60, "articulation": 65 },
        { "time" : "30s", "wpm": 160, "intonation": 85, "articulation": 77 },
        { "time" : "35s", "wpm": 142, "intonation": 72, "articulation": 71 }
      ],
}
make object for every 5 second interval all aspect needed time wpm intonation and articulation`,
            temperature: 0.2,
            maxOutputTokens: 700,
        }
    })
    const cleanedText = generateTimeSeries.text.replace("```json", '').replace("```", '');
    console.log(cleanedText)
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
        const dataImprovement = await getImprovement(storyId, userId)
        console.log(dataImprovement)
        const dataFeedback = {
          "metrics": dataMetrics.metrics,
          "timeSeries": dataTimeSeries.timeSeries,
          "improvement": dataImprovement.improvement
        }
        const allData = {
            dataFeedback,
            "badge": badge_id
        }
        const savedFeedback = await updateDetailProgress(progress_id, allData, accumulateXp)
        const savedUserDetail = await saveUserDetail(userId, accumulateXp, badge_id, progress_id)
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
        const dataImprovement = await getImprovement(storyId, userId)
        const dataFeedback = {
          "metrics": dataMetrics.metrics,
          "timeSeries": dataTimeSeries.timeSeries,
          "improvement": dataImprovement.improvement
        }
        const allData = {
            dataFeedback,
            "badge": badge_id
        }
        const savedFeedback = await updateDetailProgress(progress_id, allData, accumulateXp)
        const savedUserDetail = await saveUserDetail(userId, accumulateXp, badge_id, progress_id)
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