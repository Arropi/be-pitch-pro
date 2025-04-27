require('dotenv').config()
const express = require('express')
const authorizeToken = require('../services/middleAuthorization')
const route = express.Router()
const multer = require('multer')
const upload = multer()
const {GoogleGenAI, Type} =  require('@google/genai')
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prisma = require('../services/connection')

route.use(authorizeToken)

route.post('/:story_id', upload.single('audio'), async (req, res) =>{
    try {
      const story_id = parseInt(req.params.story_id) 
      const getStory = await prisma.stories.findUnique({
        where: {
          story_id: story_id
        }
      })
      const {system_instruction, tema} = getStory
      const systemInstruction = system_instruction.replace("Tema", tema)
      const file = req.file
      const generateValidation = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: [
          {text: "Silahkan jawab sesuai perintah penilaianmu, dan bersikap lah kritis jika tidak sesuai dna tidak ada hubungannya "},
          {
            inlineData: {
              mimeType: file.mimetype,
              data: file.buffer.toString("base64"),
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
              'result_penilaian': {
                type: Type.BOOLEAN,
                nullable:false,
                description: 'Jika sesuai dengan target penilaianmu maka berikan nilai true jika tidak berikan nilai false'
              },
              'reason': {
                type: Type.STRING,
                nullable: false,
                description: 'Berikan alasan dari penilaian yang kamu berikan mengapa seperti itu'
              }
            }
          }
        }
      })
      console.log(generateValidation)
      const nextScene = generateValidation.text
      console.log(nextScene)
  
      // const generateCurveSound = await ai.models.generateContent({
      //   model: "gemini-2.0-flash",
      //   contents: [
      //     {text: "Analyze this audio"},
      //     {
      //       inlineData: {
      //         mimeType: file.mimetype,
      //         data: file.buffer.toString("base64"),
      //       }
      //     }
      //   ],
      //   config: {
      //     systemInstruction:`You are a presentation analyzer. Evaluate the presentation based on the following aspects and provide a concise analysis in a listed format:
      // Pace (Give it rate 1 to 10)
      // Eloquence (Give it rate 1 to 10)
      // Pausing (Give it rate 1 to 10)
      // Intonation (Give it rate 1 to 10)
      
      // Articulation (Give it rate 1 to 10)
      // Word Choice (Give it rate 1 to 10)
      // At the end, give overall rating for the speakers based on analysis
      
      // Example Output Format:
      
      // Pace: 5
      // Eloquence: 8
      // Pausing: 2
      // Intonation: 1
      // Articulation: 4
      // Word Choice: 7
      // Overall: 7.8`,
      //     maxOutputTokens: 400,
      //     temperature: 0.2,
      //     responseMimeType: 'application/json',
      //   responseSchema: {
      //     type: Type.OBJECT,
      //     properties: {
      //       'rating': {
      //         type: Type.OBJECT,
      //         nullable: false,
      //         properties: {
      //           'pace': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate pace from the evaluation for the speakers'
      //           },
      //           'intonation': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate intonation from the evaluation for the speakers'
      //           },
      //           'articulation': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate articulation from the evaluation for the speakers'
      //           },
      //           'pausing': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate pausing from the evaluation for the speakers'
      //           },
      //           'eloquance': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate eloquance from the evaluation for the speakers'
      //           },
      //           'overall': {
      //             type: Type.INTEGER,
      //             nullable: false,
      //             description: 'rate overall from the evaluation for the speakers'
      //           },
      //         },
      //         required: ["pace", "intonation", "articulation", "eloquance", "overall"]
      //       }
      //     }
      //   }
      //   }
      // })
      // console.log(generateCurveSound)
      // const hasil = generateCurveSound.text
      
      res.status(201).json({
        "message": "Analyze succesful",
        "result": nextScene
      })
    } catch (error) {
      console.log(error.message)
    }
})

module.exports = route