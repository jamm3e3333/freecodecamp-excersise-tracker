const dateFns = require('date-fns')
const userModel = require('./userModel')

const handlePostUser = async (context) => {
    const { username } = context.requestBody
    const user = await (await userModel.createUser(username)).save()
    return {
        _id: user.id,
        username: user.username,
    }
}

const handleGetUsers = (_context) =>
    userModel.findUsers()


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

const handleGetUserLogs = async (context) => {
    const { from, to, limit } = context.param
    const user = await userModel.findUserForId(context.param.id)
    const userLogs = user.log?.map(x => {
        if ((from || to) && !x?.date) {
            return undefined
        }
        if (
            from &&
            dateFns.compareAsc(new Date(x?.date), new Date(from)) === -1 &&
            new Date(x.date).toDateString() !== new Date(from).toDateString()
        ) {
            return undefined
        }
        if (
            to &&
            dateFns.compareDesc(new Date(x?.date), new Date(to)) === -1 &&
            new Date(x.date).toDateString() !== new Date(to).toDateString()
        ) {
            return undefined
        }
        return x
    })?.filter(x => x)
    if (limit) {
        userLogs.slice(0, limit)
    }
    user.log = userLogs
    return user
}

module.exports = {
    handlePostUser,
    handleGetUsers,
    handlePostUserLogs,
    handleGetUserLogs,
}
