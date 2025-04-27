const prisma = require('../services/connection')

const findUserByEmail = async (email) => {
    const user = await prisma.users.findUnique({
        where: {
          email: email      
        }
    })
    return user
}

const findUser = async (indicator) =>{
    const user = await prisma.users.findUnique({
        where: {
            indicator
        }
    })
    return user
}

const findUserByUsername = async (username) => {
    const user = await prisma.users.findUnique({
        where: {
          username: username      
        }
    })
    return user
}

const createUser = async (userData, password_hashed) =>{
    const createdUser = await prisma.users.create({
        data: {
            email: userData.email,
            username: userData.username,
            hash_password: password_hashed,
        }
    })
    return createdUser
}

module.exports = {
    findUser,
    findUserByEmail,
    findUserByUsername, 
    createUser
}