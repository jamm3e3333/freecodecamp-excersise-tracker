const userModel = require('./userModel')

const handlePostUser = async (context) => {
    const { username } = context.requestBody
    const user = await (await userModel.createUser(username)).save()
    return {
        _id: user.id,
        username: user.username,
    }
}

const hangleGetUsers = (_context) => {
    return userModel.findUsers()
}

const handlePostUserLogs = async (context) => {
    const {description, date, duration} = context.requestBody
    const user = await userModel.findUserForId(context.param.id)
    const userWithLogs = await userModel.createUserLogs(user, { description, duration, date: date ?? new Date(), userId: user.id })
    const excersise = userWithLogs.log[userWithLogs.log.length - 1]
    return {
        username: userWithLogs.username,
        description: excersise.description,
        date: excersise.date,
        duration: excersise.duration,
        _id: userWithLogs.id,
    }
}

module.exports = {
    handlePostUser,
    hangleGetUsers,
    handlePostUserLogs,
}
