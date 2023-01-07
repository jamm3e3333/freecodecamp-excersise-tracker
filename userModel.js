const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,  { useNewUrlParser: false, useUnifiedTopology: true }, (error) => {
    if (error) {
        console.error({error}, 'Error connecting to the db.')
    }
})

const userSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: [{
        description: String,
        duration: Number,
        date: String,
    }],
})

const User = mongoose.model('Url', userSchema)

const createUser = (username) =>
    User.create({ username })

const createUserLogs = (user, { description, duration, date }) => {
    userLogs = [...(user.log ?? []), { description, duration, date: new Date(date).toDateString() }]
    user.log = userLogs
    user.count = userLogs.length
    return user.save()
}

const findUserForId = (id) =>
    User.findById(id)

const findUserForUsername = (username) =>
    User.find({ username })

const findUsers = () =>
    User.find()

module.exports = {
    createUser,
    createUserLogs,
    findUserForId,
    findUserForUsername,
    findUsers,
}