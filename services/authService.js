require('dotenv').config()
const { findUserByUsername, findUserByEmail, createUser } = require('../repository/authRepository')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const postDataUser = async (userData) =>{
    const checkUsername = await findUserByUsername(userData.username)
    if(checkUsername){
        throw Error('Username has been used, please use another username')
    }
    const checkEmail = await findUserByEmail(userData.email)
    if(checkEmail){
        throw Error('Email has been registered, please use another email')
    }
    const salt = await bcrypt.genSalt()
    const password_hashed = await bcrypt.hash(userData.password, salt)
    const inputUser = await createUser(userData, password_hashed)
    return inputUser
}

const getAccessToken = async (userData) =>{
    const getUser = await findUserByEmail(userData.email)
    if (getUser === null) {
        throw Error('Email is not registered, please register the email first.')
    }
    const data = {
        getUser
    }
    if (await bcrypt.compare(userData.password, getUser.hash_password)) {
        const secretToken = process.env.SECRET_TOKEN
        const accessToken = jwt.sign(data, secretToken, {expiresIn: 60*60*24})
        return {getUser, accessToken}
    } else {
        throw Error('Wrong password, try another password')
    }
}

module.exports = {
    postDataUser,
    getAccessToken
}