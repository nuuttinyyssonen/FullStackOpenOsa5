const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async(request, response) => {
    const { username, name, password, blog } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    if(password.length < 3 || username.length < 3) {
        response.status(400).json({ "error": "password or username length must be greater than 3"})
        return
    }

    const user = new User({
        username,
        passwordHash, 
        name,
        blog
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        response.status(400).json(error)
    }
})

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({}).populate('blog');
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = usersRouter