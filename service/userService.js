const User = require('../models/userModel')

async function createUser(userData) {
    try {
        const user = new User(userData)
        await user.save()
        const userWhitOutPassword = await User.findById(user._id).select('-password')
        return userWhitOutPassword
    } catch (error) {
        throw new Error(error.message)
    }

}

async function findUserById(id) {
    try {
        return await User.findById({ id }).select('-password');
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createUser,
    findUserById
}