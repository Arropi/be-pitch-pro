const express = require('express')
require('dotenv').config()
const { z, ZodError } = require('zod')
const { postDataUser, getAccessToken } = require('../services/authService')
const router = express.Router()

router.post('/register', async(req, res) =>{
    try {
        const userData = req.body
        const username = z.string({required_error: "Please enter the username"}).parse(userData.username)
        const email = z.string({required_error: "Please enter the email"}).endsWith('@gmail.com', {message: "Email is not valid, please using @gmail.com"}).parse(userData.email)
        const password = z.string({required_error: "Please enter the password"}).min(8, 'Must be 8 character').parse(userData.password)
        const inputUser = await postDataUser(userData)
        return res.status(201).json({
            "message": "Registration Succesful",
            "data" : inputUser
        })
    } catch (error) {
        if (error instanceof ZodError){
            res.status(400).json({"message": error.errors[0].message})
        } else {
            res.status(400).json({"message": error.message})
        }
    }
  })
  
router.post('/login', async(req, res) =>{
    try {
        const userData = req.body
        const email = z.string({required_error: "Please enter the email"}).endsWith('@gmail.com', {message: "Email is not valid, please using @gmail.com"}).parse(userData.email)
        const password = z.string({required_error: "Please enter the password"}).min(8, 'Must be 8 character').parse(userData.password)
        const {getUser, accessToken} = await getAccessToken(userData)
        res.status(200).json({
            "message": "Login succesfull!",
            "datas": getUser,
            "accessToken": accessToken
        })
    } catch (error) {
        if (error instanceof ZodError){
            res.status(400).json({"message": error.errors[0].message})
        } else {
            res.status(400).json({"message": error.message})
        }
    }
})

module.exports = router