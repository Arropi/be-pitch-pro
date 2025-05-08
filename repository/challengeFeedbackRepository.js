const prisma = require('../services/connection')

const getDetailStory = async (storyId) => {
    const story = await prisma.stories.findUnique({
        where: {
          story_id: storyId
        }
      })
    return story
}

const saveDetailProgress = async (progressId, buffer) => {
  const saveProgress = await prisma.detail_progress.create({
    data: {
      progress_id: progressId,
      audio: buffer
    }
  })
  return saveProgress
}

const getDetailProgress = async (progressId) => {
  const dataProgress = await prisma.detail_progress.findUnique({
    where: {
      progress_id: progressId
    }
  })
  return dataProgress
}

const updateAudioProgress = async (progressId, buffer) => {
  const audioSaved = await prisma.detail_progress.update({
    data: {
      audio: buffer
    },
    where: {
      progress_id: progressId
    }
  })
  return audioSaved
}

const updateDetailProgress = async (progressId, feedback, accumulateXp) => {
  const dataProgress = await prisma.detail_progress.update({
    data: {
      history_feedback: feedback,
      accumulate_xp: accumulateXp
    }, 
    where: {
      progress_id: progressId
    }
  })
}

const saveUserDetail = async (userId, accumulate_xp, badge) => {
  const saveUserDetail = await prisma.user_detail.create({
    data: {
      user_id: userId,
      history_xp: accumulate_xp,
      badge_id: badge
    }
  })  
}

const updateUserInformation = async (userId, xp) => {
  const updateData = await prisma.users.update({
    data: {
      xp: {
        increment: xp
      }
    },
    where: {
      user_id: userId
    }
  })
  return updateData
}


module.exports = {
    getDetailStory,
    saveDetailProgress,
    getDetailProgress,
    updateDetailProgress, 
    updateAudioProgress,
    saveUserDetail,
    updateUserInformation
}