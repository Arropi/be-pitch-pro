const prisma = require('../services/connection')

const findUserByEmail = async (email) => {
    const user = await prisma.users.findUnique({
        select: {
            user_id,
            username,
            email,
            avatar,
            avatar_mimetype,
            xp
        },
        where: {
          email: email      
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
    findUserByEmail,
    findUserByUsername, 
    createUser
}