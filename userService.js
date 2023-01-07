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

module.exports = {
    handlePostUser,
    hangleGetUsers,
}
