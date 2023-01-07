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

const createUserLogs = ({ description, duration, date, count, userId }) => {
    User.findOneAndUpdate(
        { id: userId },
        { 
            count,
            logs: [{ description, duration, date: new Date(date).toDateString() }]
        }
    )
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