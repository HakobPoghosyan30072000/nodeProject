const userService = require('../service/userService')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const findeUser = async (email) => {
    const existingUser = await User.findOne({ email });
    return existingUser ? true : false; // Return true if user exists
};
async function registerUser(req,res) {
    try {
        const { name, surename, email, password } = req.body
        if (await findeUser(email)) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const errorObj = {
            ...(!name?.length && {name: 'Name is required'}),
            ...(!surename?.length && {surename: 'Surename is required'}),
            ...(!email?.length && {email: 'Email is required'}),
            ...(!password?.length && {password: 'Password is required'}),
        }
        if (Object.keys(errorObj).some(e => e)) {
            return res.status(400).json(errorObj)
        }
        const user = await userService.createUser({ name, surename, email, password })
        res.status(201).json({message:'User registered successfully',user})
    }catch (error){
        res.status(500).json({message:error.message})
    }

}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMe(req, res) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const user = await userService.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    registerUser,
    login,
    getMe
}