const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch(() => {
        logger.error('Failed to connect to MongoDB')
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.use('/api/blogs', middleware.getTokenFrom, middleware.userExtractor , blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app